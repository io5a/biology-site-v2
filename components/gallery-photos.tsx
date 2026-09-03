import { supabase } from "@/supabase-client";

export function GalleryPhotos({ files }: { files: Array<{ name: string }> }) {
  const supabaseUrl = supabase.storage.from("gallery").getPublicUrl("")
    .data.publicUrl;

  return (
    <>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map((file)=>{
        return <Photo key={file.name} file={{ path: file.name }} url={supabaseUrl}></Photo>
      })}
    </div>
    </>
  );
}

function Photo({ file, url }: { file: { path: string }; url: string }) {
  const fileName = file.path.slice(file.path.indexOf("/") + 1);
  return (
    <div className="bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm group flex flex-col overflow-hidden transition-all hover:border-primary/50">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={url + file.path}
          alt={file.path}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        ></img>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-3 text-balance font-semibold text-foreground">
          {fileName}
        </h3>
        <a
          href={url + file.path}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3 has-[&gt;svg]:px-2.5 mt-auto gap-1 bg-transparent"
        >
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
            className="lucide lucide-download h-3 w-3"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" x2="12" y1="15" y2="3"></line>
          </svg>
          Download
        </a>
      </div>
    </div>
  );
}
