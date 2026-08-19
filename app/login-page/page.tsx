import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm/>
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