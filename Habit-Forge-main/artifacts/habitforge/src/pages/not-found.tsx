import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-5xl">⚒️</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground text-sm">This page doesn't exist in the forge.</p>
        <Link href="/dashboard">
          <span className="inline-block mt-2 text-primary hover:underline cursor-pointer text-sm">
            Back to dashboard
          </span>
        </Link>
      </div>
    </div>
  );
}
