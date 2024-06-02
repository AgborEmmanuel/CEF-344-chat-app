const express=require('express');
const app=express();
const {router,isAuthenticated}=require('./routes/routes')
const dotenv=require('dotenv').config()
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const passport=require('passport')
const auth=require('./controller/google-auth')
const http=require('http')
const socketio=require('socket.io')
const server=http.createServer(app)


mongoose.connect(process.env.mongoURI).then(()=>{
    console.log("Connected to db succesfully")
}).catch(()=>{
    console.log("Error connecting to db")
})

app.use(cors({
    origin:['http://127.0.0.1:5173','http://localhost:5173'],
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use(cookieParser())
app.use(express.static("./frontend/BlogApp/dist"))

const io=socketio(server,{
    cors:{
        origin:['http://127.0.0.1:5173','http://localhost:5173'], 
    }
})
io.on('connection',socket=>{
    socket.on("send_message",(data)=>{
        console.log(data)
        socket.broadcast.emit("receive_message",data,{dataId:socket.id})
    })
    socket.on('disconnect',()=>{
        console.log("User has left!!!")
    })
})


app.use(router)
app.use('/*',(req,res)=>{
    res.sendFile('index.html',{root:'./frontend/BlogApp/dist'})
})
server.listen(5000,()=>{
    console.log("Server is listening on port 5000")
})
