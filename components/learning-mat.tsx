import { Database } from "../src/supabase.types";
import { supabase } from "@/supabase-client";
import { useState } from "react";

type LearningMaterial =
  Database["public"]["Tables"]["learning_materials"]["Row"];

export function LearningMat({ entries }: { entries: LearningMaterial[] }) {
  // title
  //  file title
  //  file link
  const titles = new Set(entries.map((entry) => entry.group_slug));
  const groupedEntries = Array.from(titles).map((title) => {
    const groupEntries = entries.filter((entry) => entry.group_slug === title);
    const files = groupEntries.map((entry) => ({
      title: entry.title,
      link: entry.pdf,
    }));
    return { title, entries: files };
  });
  return (
    <>
      <div className="space-y-8">
        {groupedEntries.map((entry) => (
          <Category key={entry.title} entry={entry} />
        ))}
      </div>
    </>
  );
}

function Category({
  entry,
}: {
  entry: {
    title: string | null;
    entries: {
      title: string | null;
      link: string | null;
    }[];
  };
}) {
  const [opened, setOpened] = useState(true);

  return (
    <div>
      <div className="space-y-4">
        <button onClick={() => setOpened(!opened)} className="w-full text-left">
          <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent/50">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {entry.title}
              </h2>
            </div>
            <div className="ml-4">
              {opened ? (
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
                  className="lucide lucide-chevron-down h-5 w-5 text-muted-foreground"
                  data-darkreader-inline-stroke=""
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              ) : (
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
                  className="lucide lucide-chevron-up h-5 w-5 text-muted-foreground"
                >
                  <path d="m18 15-6-6-6 6"></path>
                </svg>
              )}
            </div>
          </div>
        </button>
      </div>
      <div>
        {opened ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
            {entry.entries.map((entry) => {
              return <Files key={entry.title} pdf={entry} />;
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function Files({
  pdf,
}: {
  pdf: {
    title: string | null;
    link: string | null;
  };
}) {
  const link = supabase.storage
    .from("learning-pdfs")
    .getPublicUrl(pdf.link ?? "");
  return (
    <div className="bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm flex flex-col transition-all hover:border-primary/50">
      <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div className="font-semibold text-balance text-xl">{pdf.title}</div>
      </div>
      <div className="px-6 mt-auto">
        <a
          href={link.data.publicUrl}
          
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3 has-[>svg]:px-2.5 w-full gap-1 bg-transparent"
        >
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
            className="lucide lucide-file-text h-3 w-3"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
          Vezi PDF
        </a>
      </div>
    </div>
  );
}
