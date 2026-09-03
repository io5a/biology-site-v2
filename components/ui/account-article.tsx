import { Link } from "react-router-dom"

export function AccountArticle({name,shortDesc,slug}:{[key:string]:string}){

  return(
    <Link to={"/articles/"+slug}>
      <div className="mt-5 cursor-pointer rounded-[13px] border bg-[#1a331e] p-2.5 hover:border-[#3c9b64]">
        <div className="pb-1.25 font-bold">
          <span className="font-bold text-[rgb(180,180,180)]">
            Titlu: </span>
            {name}
        </div>
        <hr className="mb-2 border border-[rgb(180,180,180)]"/>
        <div className="article-desc">
          <span className="font-bold text-[rgb(180,180,180)]">
            Descriere: </span> 
            {shortDesc}
        </div>
      </div>
    </Link>
  )
}