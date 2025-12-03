"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import type { LearningMaterial } from "@/lib/learning"

interface LearningMaterialsListProps {
  materials: LearningMaterial[]
}

export function LearningMaterialsList({ materials }: LearningMaterialsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return materials

    const lowerQuery = searchQuery.toLowerCase()
    return materials.filter(
      (material) =>
        material.title.toLowerCase().includes(lowerQuery) ||
        material.description.toLowerCase().includes(lowerQuery),
    )
  }, [materials, searchQuery])

  return (
    <>
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Materiale de studiu</h1>
            <p className="text-muted-foreground">Teste model, materiale de la clasa și alte resurse utile</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută materiale..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground">
            {filteredMaterials.length} {filteredMaterials.length === 1 ? "material găsit" : "materiale găsite"}
          </p>
        )}
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            {searchQuery ? "Nu s-au găsit materiale care să corespundă căutării." : "Nu există materiale de studiu disponibile."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
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
      )}
    </>
  )
}
