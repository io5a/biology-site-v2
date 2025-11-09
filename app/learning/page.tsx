import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText } from "lucide-react"
import { getAllLearningMaterials } from "@/lib/learning"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export default function LearningPage() {
  const learningMaterials = getAllLearningMaterials()

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Materiale de studiu</h1>
            <p className="text-muted-foreground">Teste model, materiale de la clasa și alte resurse utile</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {learningMaterials.map((material) => (
            <Card key={material.slug} className="flex flex-col transition-all hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-balance text-xl">{material.title}</CardTitle>
                <CardDescription className="text-pretty">
                  <MarkdownRenderer content={material.description} />
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 bg-transparent"
                >
                  <a href={material.pdf} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-3 w-3" />
                    View PDF
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
