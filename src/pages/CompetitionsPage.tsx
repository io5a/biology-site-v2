import { Competitions } from "@/components/competitions";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "../supabase.types";

type Competition =  
  Database["public"]["Tables"]["competitions"]["Row"];

export default function CompetitionsPage() {
  const {data: comp=[],isLoading}= useQuery<Competition[]>({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("date",{ascending:false});
      if (error) {
        throw error;
      }

      return data;
    },
    
  })
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <CompetitionsHeader/>
        <Competitions comp={comp}/>
      </div>
    </main>
  );
}

function CompetitionsHeader() {
  return (
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
          className="lucide lucide-trophy h-6 w-6 text-primary-foreground"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-foreground">Competiții</h1>
        <p className="text-muted-foreground">
          Subiecte si raspunsuri de la concursuri trecute și date despre
          viitoare concursuri
        </p>
      </div>
    </div>
  );
}
