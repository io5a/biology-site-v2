import { useAuth } from "@/src/context/AuthContext";
import { Button } from "./ui/button";
import { useState } from "react";
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
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="flex sm:w-1/3 w-3/4 flex-col items-center justify-center rounded-[10px] bg-[rgb(7,45,24)] px-5 py-6.25">
          <div>Modifica numele</div>
          <form className="flex w-full flex-col" onSubmit={handleSubmitForm}>
            <label className="mt-2.5">Nume</label>
            <input
              className="rounded-[5px] border-2 border-[#79877c] p-1"
              name="nume"
              type="text"
              value={name}
              onChange={handleChangeName}
              placeholder="Nume de utilizator"
              id="nume"
              required
            />
            <div className="mt-5 flex items-center justify-between">
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
