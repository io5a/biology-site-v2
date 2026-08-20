import { useAuth } from "@/app/context/authContext";
import { Button } from "./ui/button";
import { useState } from "react";
import "../styles/login-form.css"
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase";

export function ChangeNameForm() {
  const {setChangingName,changingName,currentUser,setUserName}=useAuth()
  const [name,setName]=useState("")
  async function handleSubmitForm(formField: React.FormEvent<HTMLFormElement>) {
    formField.preventDefault();
    try{
      await updateProfile(auth.currentUser!,{displayName:name})
    }
    catch (error: unknown){
      console.log(error)
    }
    finally{
      setUserName(name)
      setChangingName(false)
    }
  }
  function handleChangeName(formField: React.ChangeEvent<HTMLInputElement>) {
    setName(formField.target.value);
  }
  function cancelNameChange(){
    setChangingName(false)
  }
  return (
    <>
      <div className="form-center">
        <div className="form">
          <div>Modifica numele</div>
          <form className="form-fields" onSubmit={handleSubmitForm}>
            <label>Nume</label>
            <input
              name="nume"
              type="text"
              value={name}
              onChange={handleChangeName}
              placeholder="Nume de utilizator"
              id='nume'
              required/>
            <div className="buttons-change-name">
              <Button type="submit">{currentUser?.displayName ? "Schimba Numele" : "Adauga Numele"}</Button>
              <Button type="button" onClick={cancelNameChange}>Anuleaza</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
