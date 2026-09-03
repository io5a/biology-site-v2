"use client"

import "../styles/account-info.css"
import { AccountArticle } from "./ui/account-article"
import { useAuth } from "@/src/context/AuthContext"
import type { Article } from "@/lib/articles"
import { Button } from "./ui/button"
import { supabase } from "@/supabase-client"



export function AccountInfo({ articles }: { articles: Article[] }){
  const { currentUser, setChangingName, userName } = useAuth();

  async function logout() {
    await supabase.auth.signOut()
  }

  if (!currentUser) {
    return null
  }

  const userId = currentUser.id
  const pfpUrl = `https://hawsggecpatxvgvazfxh.supabase.co/storage/v1/object/public/avatars/${userId}.webp`
  return(
    <>
      <div className="account-center">
        <div className="account-details">
          <div className="account-info">
            <img className="profile-pic" src={pfpUrl}/>
            <div className="name">{userName ? `Nume utilizator: ${userName}`: ''}</div>
            <div className="mail">Email: {currentUser?.email ?? ""}</div>
            <div className="number-articles">Numarul de articole scrise: {articles.length}</div>
            <div className="buttons">
              <Button size="lg" onClick={logout}>Deconectare</Button>
              <Button size="lg" onClick={()=>setChangingName(true)}>{userName ? `Schimba Numele`: 'Adauga Nume'}</Button>
            </div>
          </div>
          <div className="articles-written">
            <div className="articles-title">
              Articole
            </div>
            <hr className="title-break"/>
            <div className="articles">
              {
                articles.map(Article => {
                  return (
                    <AccountArticle 
                    key={Article.title}
                    slug={Article.slug}
                    name={Article.title}
                    shortDesc={Article.excerpt}/>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}