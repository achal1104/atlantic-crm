// frontend/app/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to Atlantic AI CRM
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A production-ready Lead Management System designed to streamline your sales pipeline and boost conversions.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Login <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/register" 
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}