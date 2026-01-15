"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Search, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { cn } from "@/lib/utils"
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

function groupTagsByKey(tags: Record<string, string | string[]>): Record<string, string[]> {
  const grouped: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(tags)) {
    if (Array.isArray(value)) {
      grouped[key] = value
    } else {
      grouped[key] = [value]
    }
  }
  return grouped
}

// Translate tag keys to Romanian
function translateTagKey(key: string): string {
  const translations: Record<string, string> = {
    year: "An",
    subject: "Materie",
    grade: "Clasă",
    type: "Tip",
    city: "Oraș",
    cities: "Orașe",
  }
  return translations[key] || key
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const filterMenuRef = useRef<HTMLDivElement>(null)

  // Close filter menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false)
      }
    }

    if (filterMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [filterMenuOpen])

  // Get all unique tags from all groups and materials
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    groups.forEach((group) => {
      // Add group tags
      const groupTags = flattenTags(group.tags)
      groupTags.forEach((tag) => tagSet.add(tag))
      
      // Add individual material tags
      group.materials.forEach((material) => {
        if (material.tags) {
          const materialTags = flattenTags(material.tags)
          materialTags.forEach((tag) => tagSet.add(tag))
        }
      })
    })
    
    // Add ungrouped material tags
    ungroupedMaterials.forEach((material) => {
      if (material.tags) {
        const materialTags = flattenTags(material.tags)
        materialTags.forEach((tag) => tagSet.add(tag))
      }
    })
    
    return Array.from(tagSet).sort()
  }, [groups, ungroupedMaterials])

  // Group tags by key for filter display
  const groupedTagsForFilter = useMemo(() => {
    const allTagsObj: Record<string, Set<string>> = {}
    
    groups.forEach((group) => {
      const groupTags = groupTagsByKey(group.tags)
      for (const [key, values] of Object.entries(groupTags)) {
        if (!allTagsObj[key]) {
          allTagsObj[key] = new Set()
        }
        values.forEach((v) => allTagsObj[key].add(v))
      }
      
      group.materials.forEach((material) => {
        if (material.tags) {
          const materialTags = groupTagsByKey(material.tags)
          for (const [key, values] of Object.entries(materialTags)) {
            if (!allTagsObj[key]) {
              allTagsObj[key] = new Set()
            }
            values.forEach((v) => allTagsObj[key].add(v))
          }
        }
      })
    })
    
    ungroupedMaterials.forEach((material) => {
      if (material.tags) {
        const materialTags = groupTagsByKey(material.tags)
        for (const [key, values] of Object.entries(materialTags)) {
          if (!allTagsObj[key]) {
            allTagsObj[key] = new Set()
          }
          values.forEach((v) => allTagsObj[key].add(v))
        }
      }
    })
    
    const result: Record<string, string[]> = {}
    for (const [key, valueSet] of Object.entries(allTagsObj)) {
      result[key] = Array.from(valueSet).sort()
    }
    return result
  }, [groups, ungroupedMaterials])

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

  const toggleGroup = (groupSlug: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupSlug)) {
        newSet.delete(groupSlug)
      } else {
        newSet.add(groupSlug)
      }
      return newSet
    })
  }

  // Group selected tags by key for AND/OR logic
  const selectedTagsByCategory = useMemo(() => {
    const grouped: Record<string, Set<string>> = {}
    selectedTags.forEach((tag) => {
      const [key, value] = tag.split(":")
      if (!grouped[key]) {
        grouped[key] = new Set()
      }
      grouped[key].add(value)
    })
    return grouped
  }, [selectedTags])

  // Auto-expand groups when filtering is active
  useEffect(() => {
    const isFilteringActive = searchQuery.trim().length > 0 || selectedTags.size > 0
    
    if (isFilteringActive) {
      // Expand all groups that have matching materials
      const filteredGroupSlugs = new Set<string>()
      
      groups.forEach((group) => {
        // Check if group has any matching materials
        const hasMatchingMaterials = group.materials.some((material) => {
          // Check search query
          if (!matchesSearch(searchQuery, material.title, material.description, material.tags)) {
            return false
          }

          // Check selected tags with AND/OR logic
          if (Object.keys(selectedTagsByCategory).length > 0) {
            const materialTagsObj = material.tags ? groupTagsByKey(material.tags) : {}
            const groupTagsObj = groupTagsByKey(group.tags)
            
            // For each category, check if material matches at least one value (OR)
            for (const [categoryKey, selectedValues] of Object.entries(selectedTagsByCategory)) {
              const materialValues = materialTagsObj[categoryKey] || []
              const groupValues = groupTagsObj[categoryKey] || []
              
              // Combine material and group values into a single array
              const materialArray = Array.isArray(materialValues) ? materialValues : materialValues ? [materialValues] : []
              const groupArray = Array.isArray(groupValues) ? groupValues : groupValues ? [groupValues] : []
              const allValues = [...materialArray, ...groupArray]
              
              // Material must have at least one value from this category (OR)
              const hasMatch = allValues.some((val) => selectedValues.has(val))
              if (!hasMatch) {
                return false
              }
            }
          }

          return true
        })
        
        // Also check if group itself matches search
        const groupMatchesSearch = matchesSearch(searchQuery, group.title, group.description, group.tags)
        
        if (hasMatchingMaterials || groupMatchesSearch) {
          filteredGroupSlugs.add(group.slug)
        }
      })
      
      setExpandedGroups(filteredGroupSlugs)
    }
  }, [searchQuery, selectedTags, selectedTagsByCategory, groups])

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        // Filter materials within the group
        const filteredMaterials = group.materials.filter((material) => {
          // Check search query
          if (!matchesSearch(searchQuery, material.title, material.description, material.tags)) {
            return false
          }

          // Check selected tags with AND/OR logic
          // OR within categories, AND between categories
          if (Object.keys(selectedTagsByCategory).length > 0) {
            const materialTagsObj = material.tags ? groupTagsByKey(material.tags) : {}
            const groupTagsObj = groupTagsByKey(group.tags)
            
            // For each category, check if material matches at least one value (OR)
            for (const [categoryKey, selectedValues] of Object.entries(selectedTagsByCategory)) {
              const materialValues = materialTagsObj[categoryKey] || []
              const groupValues = groupTagsObj[categoryKey] || []
              
              // Combine material and group values into a single array
              const materialArray = Array.isArray(materialValues) ? materialValues : materialValues ? [materialValues] : []
              const groupArray = Array.isArray(groupValues) ? groupValues : groupValues ? [groupValues] : []
              const allValues = [...materialArray, ...groupArray]
              
              // Material must have at least one value from this category (OR)
              const hasMatch = allValues.some((val) => selectedValues.has(val))
              if (!hasMatch) {
                return false
              }
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
  }, [groups, searchQuery, selectedTagsByCategory])

  const filteredUngroupedMaterials = useMemo(() => {
    return ungroupedMaterials.filter((material) => {
      if (!matchesSearch(searchQuery, material.title, material.description, material.tags)) {
        return false
      }

      // Check selected tags with AND/OR logic for ungrouped materials
      if (Object.keys(selectedTagsByCategory).length > 0 && material.tags) {
        const materialTagsObj = groupTagsByKey(material.tags)
        
        // For each category, check if material matches at least one value (OR)
        for (const [categoryKey, selectedValues] of Object.entries(selectedTagsByCategory)) {
          const materialValues = materialTagsObj[categoryKey] || []
          const allValues = Array.isArray(materialValues) ? materialValues : materialValues ? [materialValues] : []
          
          // Material must have at least one value from this category (OR)
          const hasMatch = allValues.some((val) => selectedValues.has(val))
          if (!hasMatch) {
            return false
          }
        }
      }

      return true
    })
  }, [ungroupedMaterials, searchQuery, selectedTagsByCategory])

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
        
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Caută materiale sau tag-uri..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {Object.keys(groupedTagsForFilter).length > 0 && (
            <div className="relative" ref={filterMenuRef}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtrează
                {selectedTags.size > 0 && (
                  <Badge variant="default" className="ml-1">
                    {selectedTags.size}
                  </Badge>
                )}
              </Button>
              
              {filterMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border border-border bg-card shadow-lg p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Filtrează după tag-uri</h3>
                    {selectedTags.size > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTags(new Set())}
                        className="h-auto p-0 text-xs"
                      >
                        Șterge toate
                      </Button>
                    )}
                  </div>
                  
                  <div 
                    className="max-h-96 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'hsl(var(--border)) transparent',
                    } as React.CSSProperties}
                  >
                    {Object.entries(groupedTagsForFilter).map(([key, values]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          {translateTagKey(key)}
                        </label>
                        <div className="space-y-1">
                          {values.map((value) => {
                            const tag = `${key}:${value}`
                            return (
                              <label
                                key={tag}
                                className="flex items-center gap-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-accent/50"
                              >
                                <Checkbox
                                  checked={selectedTags.has(tag)}
                                  onCheckedChange={() => toggleTag(tag)}
                                />
                                <span className="text-sm text-muted-foreground">{value}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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
        <div className="space-y-8">
          {filteredGroups.map((group) => {
            const isFilteringActive = searchQuery.trim().length > 0 || selectedTags.size > 0
            const isExpanded = isFilteringActive ? true : expandedGroups.has(group.slug)
            
            // Collect all tags from group and materials for display
            const allGroupTags: Record<string, Set<string>> = {}
            const groupTagsObj = groupTagsByKey(group.tags)
            for (const [key, values] of Object.entries(groupTagsObj)) {
              allGroupTags[key] = new Set(values)
            }
            
            group.materials.forEach((material) => {
              if (material.tags) {
                const materialTagsObj = groupTagsByKey(material.tags)
                for (const [key, values] of Object.entries(materialTagsObj)) {
                  if (!allGroupTags[key]) {
                    allGroupTags[key] = new Set()
                  }
                  values.forEach((v) => allGroupTags[key].add(v))
                }
              }
            })
            
            const displayTags: Record<string, string[]> = {}
            for (const [key, valueSet] of Object.entries(allGroupTags)) {
              displayTags[key] = Array.from(valueSet).sort()
            }
            
            return (
              <Collapsible.Root
                key={group.slug}
                open={isExpanded}
                onOpenChange={() => {
                  // Don't allow collapsing when filtering is active
                  if (!isFilteringActive) {
                    toggleGroup(group.slug)
                  }
                }}
              >
                <div className="space-y-4">
                  <Collapsible.Trigger asChild>
                    <button className="w-full text-left">
                      <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent/50">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-foreground mb-2">{group.title}</h2>
                          {group.description && (
                            <div className="text-muted-foreground mb-3">
                              <MarkdownRenderer content={group.description} />
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(displayTags).map(([key, values]) => (
                              <Badge key={key} variant="secondary">
                                {translateTagKey(key)}: {values.join(", ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>
                  </Collapsible.Trigger>
                  
                  <Collapsible.Content>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                      {group.materials.map((material) => {
                        const materialTagsObj = material.tags ? groupTagsByKey(material.tags) : {}
                        return (
                          <Card key={material.slug} className="flex flex-col transition-all hover:border-primary/50">
                            <CardHeader>
                              <CardTitle className="text-balance text-xl">{material.title}</CardTitle>
                              <CardDescription className="text-pretty">
                                <MarkdownRenderer content={material.description} />
                              </CardDescription>
                              {Object.keys(materialTagsObj).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {Object.entries(materialTagsObj).map(([key, values]) => (
                                    <Badge key={key} variant="outline" className="text-xs">
                                      {translateTagKey(key)}: {Array.isArray(values) ? values.join(", ") : values}
                                    </Badge>
                                  ))}
                                </div>
                              )}
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
                                  Vezi PDF
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </Collapsible.Content>
                </div>
              </Collapsible.Root>
            )
          })}

          {filteredUngroupedMaterials.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Alte materiale</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUngroupedMaterials.map((material) => {
                  const materialTagsObj = material.tags ? groupTagsByKey(material.tags) : {}
                  return (
                    <Card key={material.slug} className="flex flex-col transition-all hover:border-primary/50">
                      <CardHeader>
                        <CardTitle className="text-balance text-xl">{material.title}</CardTitle>
                        <CardDescription className="text-pretty">
                          <MarkdownRenderer content={material.description} />
                        </CardDescription>
                        {Object.keys(materialTagsObj).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(materialTagsObj).map(([key, values]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {translateTagKey(key)}: {Array.isArray(values) ? values.join(", ") : values}
                              </Badge>
                            ))}
                          </div>
                        )}
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
                            Vezi PDF
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
