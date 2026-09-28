type QueryErrorProps = {
  message?: string;
};

export function QueryError({ message = "Conținutul nu a putut fi încărcat." }: QueryErrorProps) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive" role="alert">
      <p>{message}</p>
      <p className="mt-2 text-sm text-destructive/80">Verifică conexiunea și încearcă din nou.</p>
    </div>
  );
}
