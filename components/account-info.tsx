import "../styles/account-info.css"
import defaultPfp from "../content/default/default_pfp.jpg"
import { AccountArticle } from "./ui/account-article"

const testArticle={
  name:"Proiect Plantare in Gradina National",
  shortDesc:"În timp ce albinele și fluturii atrag adesea cea mai mare atenție, polenizatorii nocturni, precum moliile, liliecii și gândacii , joacă un rol la fel de esențial în menținerea sănătății ecosistemelor."
}

export function AccountInfo(){
  return(
    <>
      <div className="account-center">
        <div className="account-details">
          <div className="account-info">
            <img className="profile-pic" src="https://www.w3schools.com/html/pic_trulli.jpg"/>
            <div className="mail">ioachimdiaconu288@gmail.com</div>
            <div className="number-articles">nr of articles written</div>
          </div>
          <div className="articles-written">
            <div className="articles-title">
              Articole
            </div>
            <hr className="title-break"/>
            <div className="articles">
              <AccountArticle
              name={testArticle.name} 
              shortDesc={testArticle.shortDesc}
              />
              <AccountArticle
              name={testArticle.name} 
              shortDesc={testArticle.shortDesc}
              />
              <AccountArticle
              name={testArticle.name} 
              shortDesc={testArticle.shortDesc}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}