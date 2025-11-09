import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Download } from "lucide-react"
import { getGalleryImages } from "@/lib/gallery"

const fallbackImages = [
  {
    title: "Plant Cell Under Microscope",
    category: "Microscopy",
    description: "Detailed view of plant cell structure showing cell wall and chloroplasts",
  },
  {
    title: "DNA Double Helix Model",
    category: "Molecular Biology",
    description: "Physical model demonstrating DNA structure and base pairing",
  },
  {
    title: "Butterfly Wing Patterns",
    category: "Zoology",
    description: "Close-up of butterfly wing scales showing intricate patterns",
  },
  {
    title: "Bacterial Colonies",
    category: "Microbiology",
    description: "Petri dish showing various bacterial colony morphologies",
  },
  {
    title: "Leaf Cross Section",
    category: "Botany",
    description: "Microscopic view of leaf anatomy showing stomata and vascular tissue",
  },
  {
    title: "Coral Reef Ecosystem",
    category: "Marine Biology",
    description: "Underwater photograph of diverse coral reef community",
  },
]

export default function GalleryPage() {
  const galleryImages = getGalleryImages()
  const hasImages = galleryImages.length > 0

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Camera className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Galerie</h1>
            <p className="text-muted-foreground">
              Explorează fotografii despre biologie (
              {hasImages ? galleryImages.length : fallbackImages.length} fotografii)
            </p>
          </div>
        </div>

        {hasImages ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryImages.map((image, index) => (
              <Card key={index} className="group flex flex-col overflow-hidden transition-all hover:border-primary/50">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.filename}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-4">
                  <h3 className="mb-3 text-balance font-semibold text-foreground">{image.filename}</h3>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-auto gap-1 bg-transparent"
                  >
                    <a href={image.url} download={image.filename}>
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fallbackImages.map((image, index) => (
              <Card key={index} className="group overflow-hidden transition-all hover:border-primary/50">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <Image
                    src={`/.jpg?height=400&width=400&query=${encodeURIComponent(image.title)}`}
                    alt={image.title}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {image.category}
                  </Badge>
                  <h3 className="mb-1 text-balance font-semibold text-foreground">{image.title}</h3>
                  <p className="text-pretty text-sm text-muted-foreground">{image.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
