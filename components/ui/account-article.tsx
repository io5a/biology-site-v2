import { Button } from "./button"
import Link from "next/link"

export function AccountArticle({name,shortDesc,slug}:{[key:string]:string}){
  function handleRedirect(){

  }
  return(
    <Link href={"/articles/"+slug}>
      <div className="article">
        <div className="article-title">
          <span className="preamble-article">
            Titlu: </span>
            {name}
        </div>
        <hr className="article-line-break"/>
        <div className="article-desc">
          <span className="preamble-article">
            Descriere: </span> 
            {shortDesc}
        </div>
      </div>
    </Link>
  )
}