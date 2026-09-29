import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <div className="font-display font-700 text-7xl text-gradient mb-4">404</div>
        <h1 className="font-display font-600 text-xl mb-2">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}