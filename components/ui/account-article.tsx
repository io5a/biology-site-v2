import { Link } from "react-router-dom"

export function AccountArticle({name,shortDesc,slug}:{[key:string]:string}){
  function handleRedirect(){

  }
  return(
    <Link to={"/articles/"+slug}>
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