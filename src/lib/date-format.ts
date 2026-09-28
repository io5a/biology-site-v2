const romanianDateFormatter = new Intl.DateTimeFormat("ro-RO", {
  dateStyle: "long",
});

export function formatRomanianDate(value: string | null | undefined): string {
  if (!value) return "Dată necunoscută";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Dată necunoscută"
    : romanianDateFormatter.format(date);
}
