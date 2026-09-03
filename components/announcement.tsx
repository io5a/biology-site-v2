import type { AnnouncementType } from "@/src/types";
import { MarkdownRenderer } from "./markdown-renderer";

export function Announcement({
  announcement,
}: {
  announcement: AnnouncementType;
}) {
  return (
    <>
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition-all hover:border-primary/50">
        <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              data-slot="badge"
              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&amp;]:hover:bg-accent [a&amp;]:hover:text-accent-foreground"
            >
              {announcement.type}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
                className="lucide lucide-calendar h-3 w-3"
                data-darkreader-inline-stroke=""
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              {announcement.date}
            </div>
          </div>
          <div data-slot="card-title" className="font-semibold text-balance text-2xl">{announcement.title}</div>
          <MarkdownRenderer content={announcement.content}></MarkdownRenderer>
        </div>
      </div>
    </>
  );
}
