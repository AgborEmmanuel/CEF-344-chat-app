const userSchema=require('../model/user')
const postSchema=require('../model/post')
const jwt=require('jsonwebtoken')
const fs=require('fs')

const maxAge=3600*24
const createToken=(id,username)=>{
    return jwt.sign({id,username},process.env.Secret,{expiresIn:maxAge})
}


const register=async(req,res)=>{
    try{
        let {username,email,password}=req.body
        let newUser=await userSchema.create({username,email,password})
        if(newUser){
            let token=createToken(newUser._id,newUser.username)
            res.cookie("hooli",token,{maxAge:1000*maxAge})
            res.json({User:newUser.username,ID:newUser._id,token:token,tasks:newUser.tasks})
            return
        }
        throw Error("Couldn't register user")
    }
    catch(error){
        console.log(error.message)
        res.json({Error:error.message})
    }
}
const login=async(req,res)=>{
    try{
        let {email,password}=req.body
        let user=await userSchema.login(email,password)
        if(user){
            let posts=await postSchema.find({postedBy:user._id})
            let token=createToken(user._id,user.username)
            res.cookie("hooli",token,{maxAge:1000*maxAge})
            res.json({User:user.username,ID:user._id,token:token,tasks:posts})
            return
        }
        res.json({User:null})
    }catch (error){
        console.log(error.message)
        res.json({Error:error.message})
    }
}
const logout=(req,res)=>{
    try {
        res.cookie("hooli",'',{maxAge:500})
        res.json({Message:'Ok'})
    } catch (error) {
        res.json({Error:error.message})
    }
}
const getTasks=async(req,res)=>{
    try{
        let user=await userSchema.findOne({_id:req.params.id})
        res.json({tasks:user.tasks})
    }catch(error){
        console.log(error.message)
        res.json({Error:error.message})
    }
}
const addNewTask=async (req,res)=>{
    try{
        req.body.image=req.file.originalname
        let userId=req.params.id
        console.log(req.body)
        let post=await  postSchema.create({title:req.body.title,body:req.body.body,image:req.body.image,postedBy:userId})
        res.json({post:post})

    }catch(error){
        console.log(error.message)
        res.json({Error:error.message})
    }
}
const deleteTask=async (req,res)=>{
    try{
        let posts=await postSchema.findOneAndDelete({_id:req.params.id})
        if(posts){
            fs.unlink('frontend/BlogApp/public/assets/img/'+posts.image,(err)=>{
                if(err){
                    throw Error(err)
                }
            })
            res.json({Deleted:true})
        }else{
            res.json({Message:"Post doesn't exist"})
        }
    }catch(error){
        console.log(error.message)
        res.json({Error:error.message}) 
    }
}

const getUsers=async (req,res)=>{
    try{
        let users=await userSchema.find({},{username:1,_id:1})
        if(users){
            res.json({Users:users})
            return
        }
        throw Error("No users found")
    }catch(error){
        console.log(error.message)
        res.json({Error:error.message}) 
    }
}

exports.register=register
exports.login=login
exports.logout=logout
exports.getTasks=getTasks
exports.addNewTask=addNewTask
exports.deleteTask=deleteTask
exports.getUsers=getUsers