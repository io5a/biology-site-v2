import { supabase } from "@/supabase-client";
import type { Database } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { LearningMat } from "@/components/learning-mat";

type LearningMaterial =
  Database["public"]["Tables"]["learning_materials"]["Row"];

export default function LearningPage() {
  const { data: entries = [], isLoading } = useQuery<LearningMaterial[]>({
    queryKey: ["learn-mat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_materials")
        .select("*");

      if (error) {
        throw error;
      }

      return data;
    },
  });

  return (
    <>
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <LearningPageHeader />
        <LearningMat entries={entries} />
      </main>
    </>
  );
}

function LearningPageHeader() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
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
              className="lucide lucide-file-text h-6 w-6 text-primary-foreground"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M10 9H8"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Materiale de studiu
            </h1>
            <p className="text-muted-foreground">
              Teste model, materiale de la clasa și alte resurse utile
            </p>
          </div>
        </div>
        {/* <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative flex-1 max-w-md">
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
                className="lucide lucide-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                data-slot="input"
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
                placeholder="Caută materiale sau tag-uri..."
                type="search"
              />
            </div>
            <div className="relative">
              <button
                data-slot="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 gap-2"
                type="button"
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
                  className="lucide lucide-filter h-4 w-4"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filtrează
              </button>
            </div>
          </div> */}
      </div>
    </div>
  );
}
