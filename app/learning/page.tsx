import { getAllLearningMaterials } from "@/lib/learning"
import { LearningMaterialsList } from "@/components/learning-materials-list"

export default function LearningPage() {
  const learningMaterials = getAllLearningMaterials()

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <LearningMaterialsList materials={learningMaterials} />
      </div>
    </main>
  )
}
