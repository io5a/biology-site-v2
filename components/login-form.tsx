"use client";

import { supabase } from "@/supabase-client";
import { useState } from "react";
import { Button } from "./ui/button";
import { AuthError } from "@supabase/supabase-js";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn,setIsSingingIn]=useState(false)
  const [errorMessage,setErrorMessage]=useState("")

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
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setErrorMessage(
        error instanceof AuthError
          ? "Autentificare eșuată. Verificați datele introduse."
          : error
            ? "A apărut o eroare la autentificare."
            : "",
      )
      setIsSingingIn(false)
    }
    
  }

  return (
    <>
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="flex lg:w-1/4 md:w-1/2 w-3/4 flex-col items-center justify-center rounded-[10px] bg-[rgb(7,45,24)] px-5 py-6.25">
          <div>Conecteaza-te</div>
          <form className="flex w-full flex-col" onSubmit={handleSubmitForm}>
            <label className="mt-2.5">Email</label>
            <input
              className="rounded-[5px] border-2 border-[#79877c] p-1"
              name="email"
              type="text"
              value={email}
              onChange={handleChangeMail}
              placeholder="exemplu@gmail.com"
              id='email'
              required
            />
            <label className="mt-2.5">Parola</label>
            <input
              className="password rounded-[5px] border-2 border-[#79877c] p-1"
              name="password"
              type="password"
              value={password}
              onChange={handleChangePassword}
              placeholder="Minim 8 caractere"
              id="password"
              required
            />
            <div className="mt-5 flex items-center justify-between">
              <Button type="submit">Conectare</Button>
            </div>
          </form>
          <p>{errorMessage}</p>
        </div>
      </div>
    </>
  );
}
