import { GalleryPhotos } from "@/components/gallery-photos";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";

export default function GalleryPage() {
  const {data,isLoading}= useQuery({
    queryKey:["photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from("gallery")
        .listV2({});
      if (error) {
        throw error;
      }

      return data;
    },
  })
  if(!isLoading)
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GalleryHeader nrFoto={data?.objects.length}/>
        <GalleryPhotos files={data?.objects.map((obj)=>({name:obj.name})) ?? []}/>
      </div>
    </main> 
  );
}

function GalleryHeader({nrFoto = 0}:{nrFoto?:number}) {
  return(
  <div className="mb-12 flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-camera h-6 w-6 text-primary-foreground"
      >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
        <circle cx="12" cy="13" r="3"></circle>
      </svg>
    </div>
    <div>
      <h1 className="text-4xl font-bold text-foreground">Galerie</h1>
      <p className="text-muted-foreground">
        {`Explorează fotografii despre biologie (${nrFoto} fotografii)`}
      </p>
    </div>
  </div>
  )
}
