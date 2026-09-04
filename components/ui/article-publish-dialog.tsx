import { useState, type ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

type ArticlePublishDialogProps = {
  trigger: ReactNode;
  onConfirm: () => Promise<string | null>;
};

export function ArticlePublishDialog({
  trigger,
  onConfirm,
}: ArticlePublishDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmPublish() {
    setIsPublishing(true);
    setError(null);

    try {
      const result = await onConfirm();

      if (result) {
        setError(result);
        return;
      }

      setOpen(false);
    } catch {
      setError("Articolul nu a putut fi publicat.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
      }}
    >
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg">
          <AlertDialog.Title className="text-lg font-semibold">
            Publici articolul?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">
            Dupa publicare, articolul va deveni vizibil tuturor si nu va mai
            putea fi editat ulterior.
          </AlertDialog.Description>
          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" disabled={isPublishing}>
                Anuleaza
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  void confirmPublish();
                }}
                disabled={isPublishing}
              >
                {isPublishing ? "Se publica..." : "Publica articolul"}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}