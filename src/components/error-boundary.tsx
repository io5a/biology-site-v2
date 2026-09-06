import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application rendering error", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive" role="alert">
            <h1 className="text-xl font-semibold">A apărut o eroare</h1>
            <p className="mt-2">Reîncarcă pagina pentru a încerca din nou.</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
