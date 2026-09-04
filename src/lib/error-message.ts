type SupabaseErrorShape = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

export function getErrorMessage(
  error: unknown,
  fallback = "Actiunea nu a putut fi finalizata.",
): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null) {
    const candidate = error as SupabaseErrorShape;
    const message = typeof candidate.message === "string" ? candidate.message : "";
    const details = typeof candidate.details === "string" ? candidate.details : "";
    const hint = typeof candidate.hint === "string" ? candidate.hint : "";
    const code = typeof candidate.code === "string" ? `[${candidate.code}]` : "";
    const parts = [code, message, details, hint].filter(Boolean);

    if (parts.length) return parts.join(" ");
  }

  return fallback;
}