import { Link } from 'react-router-dom';
import { TrendingDown } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-600 rounded-2xl p-4">
            <TrendingDown className="h-10 w-10 text-white" aria-hidden="true" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
        <p className="text-slate-500 mb-8">This page doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
