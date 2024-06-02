const express=require('express')
const router=express.Router()
const passport=require('passport')
const jwt=require('jsonwebtoken')
const {register,login,logout,getTasks,addNewTask,deleteTask,getUsers}=require('../controller/controller')
const multer=require('multer')

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
const upload=multer({storage:storage})

router.get('/cookie',(req,res)=>{
    console.log("//////")
    console.log(req.cookies.authApp)
    console.log("//////")
    res.cookie("authApp",req.cookies.authApp,{maxAge:1000*3600*24})
    res.json({Message:req.cookies})
})
router.get("/home",(req,res)=>{
    res.send('<a href="/auth/google">Login with google</a>')
})
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { session:false,failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get("/auth",(req,res)=>{
    res.send("Reached")
})
router.post('/getUsers',isAuthenticated,getUsers)
router.post("/Register",register)
router.post("/Login",login)
router.get("/logout",logout)
router.get("/task/getTasks/:id",getTasks)
router.post("/task/add/:id",upload.single('image'),addNewTask)
// router.patch("/task/:id",updateTask)
router.post("/task/delete/:id",deleteTask)


module.exports={router,isAuthenticated}