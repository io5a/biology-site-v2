export function AccountArticle({name,shortDesc}:{[key:string]:string}){
  return(
    <div className="article">
      <div className="article-title">
        <span className="preamble-article">
          Titlu: </span>
          {name}
      </div>
      <div className="article-desc">
        <span className="preamble-article">
          Descriere: </span> 
          {shortDesc}
      </div>
    </div>
  )
}