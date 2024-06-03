const express=require('express')
const router=express.Router()
const passport=require('passport')
const jwt=require('jsonwebtoken')
const {register,login,logout,getTasks,addNewTask,deleteTask,getUsers}=require('../controller/controller')
const multer=require('multer')

//to check if user is authenticated
const isAuthenticated=(req,res,next)=>{
    let token=req.cookies.hooli
    if(req.body.token){
      if(!token){
        token=req.body.token
      }
    }
    if(token){
       jwt.verify(token,process.env.Secret,(err,decodedtoken)=>{
          if(err){
            console.log(err)
            // res.redirect('/')
            res.json({Error:"Couldn't verify token"})
            return
          }
          console.log(decodedtoken)
          next()
       })
    }else{
      res.json({Message:"Not logged in"})
    }
}

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'frontend/BlogApp/public/assets/img')
  },
  filename:(req,file,cb)=>{
      cb(null,file.originalname)
  }
})

//function to upload photos
const upload=multer({storage:storage})

router.get("/home",(req,res)=>{
    res.send('<a href="/auth/google">Login with google</a>')
})
router.post('/getUsers',isAuthenticated,getUsers)
//route to register users
router.post("/Register",register)
//route to login users
router.post("/Login",login)
//route to logout users
router.get("/logout",logout)
router.get("/task/getTasks/:id",getTasks)
router.post("/task/add/:id",upload.single('image'),addNewTask)
router.post("/task/delete/:id",deleteTask)


module.exports={router,isAuthenticated}
