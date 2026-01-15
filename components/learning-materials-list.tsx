"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, X } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import type { LearningMaterial, LearningGroup } from "@/lib/learning"

interface LearningMaterialsListProps {
  groups: LearningGroup[]
  ungroupedMaterials: LearningMaterial[]
}

function flattenTags(tags: Record<string, string | string[]>): string[] {
  const result: string[] = []
  for (const [key, value] of Object.entries(tags)) {
    if (Array.isArray(value)) {
      result.push(...value.map((v) => `${key}:${v}`))
    } else {
      result.push(`${key}:${value}`)
    }
  }
  return result
}

function matchesSearch(
  searchQuery: string,
  title: string,
  description?: string,
  tags?: Record<string, string | string[]>,
): boolean {
  if (!searchQuery.trim()) return true

  const lowerQuery = searchQuery.toLowerCase()
  
  // Search in title
  if (title.toLowerCase().includes(lowerQuery)) return true
  
  // Search in description
  if (description && description.toLowerCase().includes(lowerQuery)) return true
  
  // Search in tags
  if (tags) {
    const tagStrings = flattenTags(tags)
    if (tagStrings.some((tag) => tag.toLowerCase().includes(lowerQuery))) return true
  }
  
  return false
}

export function LearningMaterialsList({ groups, ungroupedMaterials }: LearningMaterialsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  // Get all unique tags from all groups
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    groups.forEach((group) => {
      const tags = flattenTags(group.tags)
      tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [groups])

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        // Filter materials within the group
        const filteredMaterials = group.materials.filter((material) => {
          // Check search query
          if (!matchesSearch(searchQuery, material.title, material.description, material.tags)) {
            return false
          }

          // Check selected tags
          if (selectedTags.size > 0) {
            const materialTags = material.tags ? flattenTags(material.tags) : []
            const groupTags = flattenTags(group.tags)
            const allMaterialTags = [...materialTags, ...groupTags]
            
            // Material must match at least one selected tag
            if (!allMaterialTags.some((tag) => selectedTags.has(tag))) {
              return false
            }
          }

          return true
        })

        // Only include group if it matches search or has filtered materials
        const groupMatchesSearch = matchesSearch(searchQuery, group.title, group.description, group.tags)
        
        if (groupMatchesSearch || filteredMaterials.length > 0) {
          return {
            ...group,
            materials: filteredMaterials,
          }
        }

        return null
      })
      .filter((group): group is LearningGroup => group !== null && group.materials.length > 0)
  }, [groups, searchQuery, selectedTags])

  const filteredUngroupedMaterials = useMemo(() => {
    return ungroupedMaterials.filter((material) => {
      if (!matchesSearch(searchQuery, material.title, material.description, material.tags)) {
        return false
      }

      // Ungrouped materials don't have tags, so they pass tag filter
      return true
    })
  }, [ungroupedMaterials, searchQuery])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tag)) {
        newSet.delete(tag)
      } else {
        newSet.add(tag)
      }
      return newSet
    })
  }

  const totalFilteredCount = filteredGroups.reduce((sum, group) => sum + group.materials.length, 0) + filteredUngroupedMaterials.length

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
        
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută materiale sau tag-uri..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {allTags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const [key, value] = tag.split(":")
                const isSelected = selectedTags.has(tag)
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {key}: {value}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                )
              })}
            </div>
            {selectedTags.size > 0 && (
              <button
                onClick={() => setSelectedTags(new Set())}
                className="mt-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Șterge filtrele
              </button>
            )}
          </div>
        )}

        {(searchQuery || selectedTags.size > 0) && (
          <p className="text-sm text-muted-foreground">
            {totalFilteredCount} {totalFilteredCount === 1 ? "material găsit" : "materiale găsite"}
          </p>
        )}
      </div>

      {filteredGroups.length === 0 && filteredUngroupedMaterials.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            {searchQuery || selectedTags.size > 0
              ? "Nu s-au găsit materiale care să corespundă căutării."
              : "Nu există materiale de studiu disponibile."}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredGroups.map((group) => (
            <div key={group.slug} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{group.title}</h2>
                {group.description && (
                  <div className="text-muted-foreground mb-3">
                    <MarkdownRenderer content={group.description} />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {flattenTags(group.tags).map((tag) => {
                    const [key, value] = tag.split(":")
                    return (
                      <Badge key={tag} variant="secondary">
                        {key}: {value}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.materials.map((material) => (
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
          ))}

          {filteredUngroupedMaterials.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Alte materiale</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUngroupedMaterials.map((material) => (
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
          )}
        </div>
      )}
    </>
  )
}
