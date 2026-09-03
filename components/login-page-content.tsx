"use client";

import { AccountInfo } from "@/components/account-info";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/src/context/AuthContext";
import { ChangeNameForm } from "./change-name";

export function LoginPageContent() {
  const { userLoggedIn, changingName } = useAuth();
  return changingName ? (
    <ChangeNameForm />
  ) : userLoggedIn ? (
    <AccountInfo/>
  ) : (
    <LoginForm />
  );
}
