"use client"

import { AccountInfo } from "@/components/account-info"
import { LoginForm } from "@/components/login-form"
import type { Article } from "@/lib/articles"
import { useAuth } from "@/app/context/authContext/supabase"
import { ChangeNameForm } from "./change-name"

export function LoginPageContent({ articles }: { articles: Article[] }) {
  const { userLoggedIn , changingName} = useAuth()
  return changingName ? <ChangeNameForm/> :
  (userLoggedIn
    ? <AccountInfo articles={articles} />
    : <LoginForm />)
}