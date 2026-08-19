"use client";

import { useState } from "react";
import { login } from "@/lib/authApi";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function handleChangeName(formField: React.ChangeEvent<HTMLInputElement>) {
    console.log(formField);

    setUsername(formField.target.value);
  }
  function handleChangePassword(
    formField: React.ChangeEvent<HTMLInputElement>,
  ) {
    setPassword(formField.target.value);
  }
  async function handleSubmitName(formField: React.FormEvent<HTMLFormElement>) {
    console.log(formField);
    formField.preventDefault();
    const isAuthenticated = await login({ username, password });
    if(isAuthenticated)
      console.log("Login succesful")
    else
      console.log("Login not succesful")
  }

  return (
    <>
      <form onSubmit={handleSubmitName}>
        <label>Username</label>
        <br />
        <input
          name="email"
          type="text"
          value={username}
          onChange={handleChangeName}
          placeholder="Min 8 characters"
          id='email'
          required
        />
        <br />
        <label>Password</label>
        <br />
        <input
          name="password"
          type="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="Min 8 characters"
          id="password"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
