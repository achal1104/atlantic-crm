// frontend/app/(auth)/login/page.tsx

import Link from "next/link";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 bg-white">
        <div className="flex items-center gap-2 mb-12">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Atlantic AI CRM</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8 text-sm">Please enter your details to sign in.</p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              placeholder="admin@atlantic.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-gray-600">Remember for 30 days</span>
            </label>
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {/* Right Side - Branding/Visual */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
        
        <div className="z-10 text-center max-w-md px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Manage leads smarter, not harder.
          </h2>
          <p className="text-gray-600">
            Our AI-powered CRM streamlines your pipeline, automates follow-ups, and helps your team close more deals.
          </p>
        </div>
      </div>
    </div>
  );
}