import { auth } from "@/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";

export async function doCreateUserWithEmailAndPassword(email:string,password:string){
  return createUserWithEmailAndPassword(auth,email,password)
}
export async function doSignInWithEmailAndPassword(email:string,password:string) {
  return signInWithEmailAndPassword(auth,email,password)
}

export function doSignOut(){
  return auth.signOut()
}

export function doPasswordReset(email:string){
  return sendPasswordResetEmail(auth,email)
}

export function doPasswordChange(password:string){
  return updatePassword(auth.currentUser!,password)
}

export function doChangeName(name:string){
  return updateProfile(auth.currentUser!,{displayName:name})
}

