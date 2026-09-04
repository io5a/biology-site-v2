import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { supabase } from "@/supabase-client";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/src/lib/error-message";
import { convertImageToWebp } from "@/src/lib/image-utils";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

type ChangeProfilePictureProps = {
  userId: string;
  onUploaded: () => void;
};

export function ChangeProfilePicture({
  userId,
  onUploaded,
}: ChangeProfilePictureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Alege un fisier imagine.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Imaginea trebuie sa aiba cel mult 5MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const webpImage = await convertImageToWebp(file);
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${userId}.webp`, webpImage, {
          cacheControl: "3600",
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) throw uploadError;
      onUploaded();
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Poza de profil nu a putut fi salvata."));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <ImageUp className="h-4 w-4" />
        {isUploading ? "Se incarca..." : "Schimba poza"}
      </Button>
      {error && (
        <p className="max-w-56 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}