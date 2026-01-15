import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar } from "lucide-react"
import { getAllAnnouncements } from "@/lib/announcements"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export default function AnnouncementsPage() {
  const announcements = getAllAnnouncements()

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Bell className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Anunțuri</h1>
            <p className="text-muted-foreground">Rămâi la curent cu cele mai recente anunțuri și evenimente</p>
          </div>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.slug} className="transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{announcement.type}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {announcement.date}
                  </div>
                </div>
                <CardTitle className="text-balance text-2xl">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-pretty leading-relaxed text-muted-foreground">
                  <MarkdownRenderer content={announcement.content} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
