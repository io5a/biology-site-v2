type SupabaseErrorShape = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

function isNetworkErrorMessage(message: string): boolean {
  return /aborted|connection|failed to fetch|fetch failed|load failed|network/i.test(
    message,
  );
}

function withoutStack(message: string): string {
  return message.split(/\r?\n\s*at\s+/i, 1)[0].trim();
}

export function getErrorMessage(
  error: unknown,
  fallback = "Actiunea nu a putut fi finalizata.",
): string {
  if (typeof error === "string" && error.trim()) {
    const message = withoutStack(error);
    return isNetworkErrorMessage(message) ? fallback : message;
  }

  if (error instanceof Error && error.message) {
    const message = withoutStack(error.message);
    return isNetworkErrorMessage(message) || error.name === "AbortError"
      ? fallback
      : message;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as SupabaseErrorShape;
    const message = typeof candidate.message === "string" ? candidate.message : "";
    const details = typeof candidate.details === "string" ? candidate.details : "";
    const hint = typeof candidate.hint === "string" ? candidate.hint : "";
    const code = typeof candidate.code === "string" ? `[${candidate.code}]` : "";
    const parts = [code, message, details, hint]
      .filter(Boolean)
      .map(withoutStack);

    if (parts.length) {
      const combinedMessage = parts.join(" ");
      return isNetworkErrorMessage(combinedMessage) ? fallback : combinedMessage;
    }
  }

  return fallback;
}