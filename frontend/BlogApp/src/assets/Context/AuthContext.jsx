import React , { createContext, useEffect, useState } from "react"

export const AuthContext=createContext()
const AuthContextProvider = (props) => {
    const [users,setUsers]=useState([])
    let localState=localStorage.getItem("hooli")
    localState=JSON.parse(localState)
    const [userState,setUserState]=useState({
        isLoggedIn:(localState && localState.isLoggedIn) || false,
        username:(localState && localState.username) || "Guest",
        id:(localState && localState.id) || "",
        token:(localState && localState.token) || "",
        posts:(localState && localState.posts) || []
    })
    const updateState=(IsLoggedIn,Username,Id,Token,Posts)=>{
        setUserState({
            isLoggedIn:IsLoggedIn,
            username:Username,
            id:Id,
            token:Token,
            posts:Posts
        })
        localStorage.setItem("hooli",JSON.stringify({isLoggedIn:IsLoggedIn,username:Username,id:Id,token:Token,posts:Posts}))
        if(!IsLoggedIn){
            localStorage.removeItem("hooli")
            document.cookie="hooli='';expires=Thu, 01 Jan 2020 00:00:00 UTC;"
        }
        // (!IsLoggedIn && 
        //     localStorage.removeItem("hooli")
        // )
    }
    useEffect(()=>{
        fetch('http://localhost:5000/getUsers',{
            credentials:'include',
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({token:userState.token})
        })
        .then(res=>{
            if(res.ok) return res.json()
            throw Error("Error. Couldn't check user state")
        })
        .then(data=>{
            setUsers(data.Users)
        })
        .catch(error=>{
            console.log(error)
        })
    },[userState.isLoggedIn])
    return ( 
        <AuthContext.Provider value={{userState,updateState,users}}>
            {props.children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;