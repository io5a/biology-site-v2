"use client";

import { useContext, useEffect, useState } from "react";
import {auth} from "../../../firebase"
import {onAuthStateChanged} from "firebase/auth"
import React from "react";



const AuthContext = React.createContext();

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}){
  const [currentUser,setCurrentUser]=useState(null)
  const [userLoggedIn,setUserLoggedIn]=useState(false)
  const [loading,setLoading]=useState(true)
  const [changingName,setChangingName]=useState(false)
  const [userName,setUserName]=useState("")

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,initializeUser)
    return unsubscribe
  },[])
  async function initializeUser(user) {
    console.log(user)
    if(user){
      setCurrentUser({...user})
      setUserLoggedIn(true)
    }
    else{
      setCurrentUser(null)
      setUserLoggedIn(false)
    }
    setLoading(false)
  }
  const value={
    currentUser,
    userLoggedIn,
    loading,
    changingName,
    userName,
    setChangingName,
    setUserName
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}