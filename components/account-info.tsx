"use client"

import "../styles/account-info.css"
import { AccountArticle } from "./ui/account-article"
import { useAuth } from "@/app/context/authContext"
import type { Article } from "@/lib/articles"
import { Button } from "./ui/button"
import { doChangeName, doSignOut } from "@/app/firebase/firebase"
import { ArticlesList } from "./articles-list"


const testArticle={
  name:"Proiect Plantare in Gradina National",
  shortDesc:"În timp ce albinele și fluturii atrag adesea cea mai mare atenție, polenizatorii nocturni, precum moliile, liliecii și gândacii , joacă un rol la fel de esențial în menținerea sănătății ecosistemelor."
}

export function AccountInfo({ articles }: { articles: Article[] }){
  const { currentUser, userLoggedIn, loading ,setChangingName,userName,setUserName} = useAuth();
  return(
    <>
      <div className="account-center">
        <div className="account-details">
          <div className="account-info">
            <img className="profile-pic" src="https://www.w3schools.com/html/pic_trulli.jpg"/>
            <div className="name">{userName ? `Nume utilizator: ${userName}`: ''}</div>
            <div className="mail">Email: {currentUser?.email ?? ""}</div>
            <div className="number-articles">Numarul de articole scrise: {articles.length}</div>
            <div className="buttons">
              <Button size="lg" onClick={doSignOut}>Deconectare</Button>
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
                  console.log(Article)
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