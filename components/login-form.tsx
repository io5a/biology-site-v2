"use client";

import { supabase } from "@/supabase-client";
import { useState } from "react";
import { errorHumanReadable } from "@/app/firebase/error-handling";
import { Button } from "./ui/button";
import "../styles/login-form.css"
import { AuthError } from "@supabase/supabase-js";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn,setIsSingingIn]=useState(false)
  const [errorMessage,setErrorMessage]=useState("")
  //const [name,setName]=useState('')

  function handleChangeMail(formField: React.ChangeEvent<HTMLInputElement>) {
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
      // setIsSingingIn(true)
      // try {
      //   await signInWithEmailAndPassword(auth, email, password)
      //   //await updateProfile(auth.currentUser!,{displayName:name})
      //   setErrorMessage("")
      // } catch (error: unknown) {
      //   console.log(error)
      //   setErrorMessage(
      //     error instanceof FirebaseError  ? 
      //     errorHumanReadable(error.code) : 
      //     "Unable to sign in.",
      //   )
      // } finally {
      //   setIsSingingIn(false)
      // }
      const {error} = await supabase.auth.signInWithPassword({email,password})
      setErrorMessage(error instanceof AuthError ? String(error.code) : "")
      setIsSingingIn(false)
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
      <div className="form-center">
        <div className="form">
          <div>Conecteaza-te</div>
          <form className="form-fields" onSubmit={handleSubmitForm}>
            {/* <label>Nume</label>
            <input
              name="nume"
              type="text"
              value={name}
              onChange={handleChangeName}
              placeholder="Nume de utilizator"
              id='email'
              required/> */}
            <label>Email</label>
            <input
              name="email"
              type="text"
              value={email}
              onChange={handleChangeMail}
              placeholder="exemplu@gmail.com"
              id='email'
              required
            />
            <label>Parola</label>
            <input
              className="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChangePassword}
              placeholder="Minim 8 caractere"
              id="password"
              required
            />
            <div className="buttons">
              <Button type="submit">Conectare</Button>
            </div>
          </form>
          <p>{errorMessage}</p>
        </div>
      </div>
    </>
  );
}
