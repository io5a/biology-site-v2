export function errorHumanReadable(error:string) : string{
  console.log(error)
  if(error==="auth/email-already-exists")
    return "Emailul este luat deja. Incercati un alt email sau resetati parola."
  if(error==="auth/invalid-email")
    return "Emailul este gresit. Incercati cu un alt email sau asigurati-va ca acesta este scris corect."
  if(error==="auth/invalid-password")
    return "Parola este invalida."
  if(error==="auth/too-many-requests")
    return "Prea multe incercari. Reveniti mai tarziu."
  if(error==="auth/user-disabled")
    return "Exista un motiv pentru care ti-am dezactivat contul."
  if(error==="auth/user-not-found")
    return "Utilizatorul nu exista. Reincercati"
  if(error==="auth/invalid-credential")
    return "Parola sau emailul e gresit. Incearca din nou sau reseteaza parola."
  return "Sa stricat :("
  
}