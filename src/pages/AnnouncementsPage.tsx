import { Announcement } from '@/components/announcement'
import { Skeleton } from '@/src/components/ui/skeleton'
import { supabase } from '@/supabase-client'
import { useQuery } from '@tanstack/react-query'
import type { AnnouncementType } from '@/src/types'

const fetchAnnouncements = async () => {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []) as AnnouncementType[]
}

function SkeletonAnnouncements() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mb-3 h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-5/6" />
        </div>
      ))}
    </div>
  )
}

export default function AnnouncementsPage() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
  })

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell h-6 w-6 text-primary-foreground"
              data-darkreader-inline-stroke=""
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Anunțuri</h1>
            <p className="text-muted-foreground">Rămâi la curent cu cele mai recente anunțuri și evenimente</p>
          </div>
        </div>

        {isLoading ? <SkeletonAnnouncements /> : <div className="space-y-6">{announcements.map((ann) => <Announcement key={ann.slug} announcement={ann} />)}</div>}
      </div>
    </main>
  )
}