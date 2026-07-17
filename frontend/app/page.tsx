import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Atlantic AI CRM
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Lead management built for modern sales teams.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Sign in <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/register"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-white font-medium transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
