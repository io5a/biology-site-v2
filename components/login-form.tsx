"use client";

import { useState } from "react";
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword } from "@/app/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../app/context/authContext"
import { error, log } from "console";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { errorHumanReadable } from "@/app/firebase/error-handling";

export function LoginForm() {
  console.log(useAuth)
  // const { currentUser, userLoggedIn, loading } = useAuth();
  //const {userLoggedIn}=useAuth() ?? undefined
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn,setIsSingingIn]=useState(false)
  const [errorMessage,setErrorMessage]=useState("")

  function handleChangeName(formField: React.ChangeEvent<HTMLInputElement>) {
    setEmail(formField.target.value);
  }
  
  function handleChangePassword(
    formField: React.ChangeEvent<HTMLInputElement>,
  ) {
    setPassword(formField.target.value);
  }

  async function handleSubmitForm(formField: React.FormEvent<HTMLFormElement>) {
    formField.preventDefault();
    if(!isSigningIn){
      setIsSingingIn(true)
      try {
        await signInWithEmailAndPassword(auth, email, password)
        setErrorMessage("")
      } catch (error: unknown) {
        console.log(error)
        setErrorMessage(
          error instanceof FirebaseError  ? 
          errorHumanReadable(error.code) : 
          "Unable to sign in.",
        )
      } finally {
        setIsSingingIn(false)
      }
    }
    /**
     *     demo authentification
    const isAuthenticated = await login({ username, password });
    if(isAuthenticated)
      console.log("Login succesful")
    else
      console.log("Login not succesful")
     */
  }

  return (
    <>
      <form onSubmit={handleSubmitForm}>
        <label>Email</label>
        <br />
        <input
          name="email"
          type="text"
          value={email}
          onChange={handleChangeName}
          placeholder="example@gmail.com"
          id='email'
          required
        />
        <br />
        <label>Parola</label>
        <br />
        <input
          name="password"
          type="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="Minim 8 caractere"
          id="password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>{errorMessage}</p>
    </>
  );
}
