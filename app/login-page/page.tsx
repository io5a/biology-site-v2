import { LoginForm } from "@/components/login-form"
import { AccountInfo } from "@/components/account-info"
import { getAllArticles } from "@/lib/articles"
import { useAuth } from "../context/authContext"
import { LoginPageContent } from "@/components/login-page-content"

export default function LoginPage() {
  const articles = getAllArticles()
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <LoginPageContent articles={articles} />
    </main>
  )
}


/**
 * import { getAllLearningMaterialsWithGroups } from "@/lib/learning"
 import { LearningMaterialsList } from "@/components/learning-materials-list"
 
 export default function LearningPage() {
   const { groups, ungroupedMaterials } = getAllLearningMaterialsWithGroups()
 
   return (
     <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
       <div className="mx-auto max-w-7xl">
         <LearningMaterialsList groups={groups} ungroupedMaterials={ungroupedMaterials} />
       </div>
     </main>
   )
 }
 
 */