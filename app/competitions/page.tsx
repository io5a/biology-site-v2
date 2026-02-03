import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Calendar, Download, Globe2, MapPin } from "lucide-react"
import { getAllCompetitions } from "@/lib/competitions"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export default function CompetitionsPage() {
  const competitions = getAllCompetitions()

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Competiții</h1>
            <p className="text-muted-foreground">Subiecte si raspunsuri de la concursuri trecute și date despre viitoare concursuri</p>
          </div>
        </div>

        <div className="space-y-6">
          {competitions.map((competition) => {
            const showWebsiteButton = Boolean(competition.officialUrl)
            const hasButtons = competition.hasPastQuestions || competition.hasAnswerKey || showWebsiteButton
            
            return (
              <Card
                key={competition.slug}
                className={`transition-all ${
                  competition.status === "Upcoming" ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
                }`}
              >
                <CardHeader className={hasButtons ? "pb-4" : "pb-3 pt-4"}>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={competition.status === "Upcoming" ? "default" : "secondary"}>
                      {competition.status}
                    </Badge>
                    {competition.year && <Badge variant="outline">{competition.year}</Badge>}
                    {competition.stage && (
                      <Badge variant="outline" className="capitalize">
                        {competition.stage}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {competition.date}
                    </div>
                    {competition.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {competition.location}
                      </div>
                    )}
                    
                  </div>
                  <CardTitle className="text-2xl">{competition.title}</CardTitle>
                  {competition.description && (
                    <CardDescription className="text-pretty h-2 text-0.5xl">
                      <MarkdownRenderer content={competition.description} />
                    </CardDescription>
                  )}
                </CardHeader>
                {hasButtons && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {competition.hasPastQuestions && competition.pastQuestions && (
                        <Button asChild variant="outline" size="sm" className="gap-1 bg-transparent">
                          <a href={competition.pastQuestions} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3" />
                            Past Questions
                          </a>
                        </Button>
                      )}
                      {competition.hasAnswerKey && competition.answerKey && (
                        <Button asChild variant="outline" size="sm" className="gap-1 bg-transparent">
                          <a href={competition.answerKey} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3" />
                            Answer Key
                          </a>
                        </Button>
                      )}
                      {showWebsiteButton && competition.officialUrl && (
                        <Button asChild variant="outline" size="sm" className="gap-1 bg-transparent">
                          <a href={competition.officialUrl} target="_blank" rel="noopener noreferrer">
                            <Globe2 className="h-3 w-3" />
                            Site concurs
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
