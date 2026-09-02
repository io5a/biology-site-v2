import { useAuth } from "@/src/context/AuthContext";
import { Button } from "./ui/button";
import { useState } from "react";
import "../styles/login-form.css";
import { supabase } from "@/supabase-client";

export function ChangeNameForm() {
  const { setChangingName, currentUser, setUserName, userName } = useAuth();
  const [name, setName] = useState("");

  async function handleSubmitForm(formField: React.FormEvent<HTMLFormElement>) {
    formField.preventDefault();

    if (!currentUser) return;

    const { data: rows, error: selErr } = await supabase.from("users").select("user_id").eq("user_id", currentUser.id);
    if (selErr) throw selErr;
    if (rows && rows.length > 0) {
      const { error: updErr } = await supabase.from("users").update({ name }).eq("user_id", currentUser.id);
      if (updErr) throw updErr;
    } else {
      const { error: insErr } = await supabase.from("users").insert({ user_id: currentUser.id, name });
      if (insErr) throw insErr;
    }
    setUserName(name);
    setChangingName(false);
  }
  function handleChangeName(formField: React.ChangeEvent<HTMLInputElement>) {
    setName(formField.target.value);
  }
  function cancelNameChange() {
    setChangingName(false);
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
              id="nume"
              required
            />
            <div className="buttons-change-name">
              <Button type="submit">
                {userName ? "Schimba Numele" : "Adauga Numele"}
              </Button>
              <Button type="button" onClick={cancelNameChange}>
                Anuleaza
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
