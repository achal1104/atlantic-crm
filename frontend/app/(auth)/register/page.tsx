// frontend/app/(auth)/register/page.tsx

import Link from "next/link";
import { Building2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 bg-white">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Atlantic AI CRM</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
        <p className="text-gray-500 mb-8 text-sm">Join us to start managing your pipeline effectively.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>

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
              placeholder="Create a strong password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Log in
          </Link>
        </p>
      </div>

      {/* Right Side - Branding/Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 ml-10 mt-10 w-72 h-72 rounded-full bg-blue-600 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 mr-10 mb-10 w-96 h-96 rounded-full bg-indigo-500 blur-3xl opacity-20"></div>
        
        <div className="z-10 text-center max-w-md px-8 text-white">
           <h2 className="text-3xl font-bold mb-4">
            Built for modern sales teams.
          </h2>
          <p className="text-slate-300">
            Track leads from every source—Website, Ads, WhatsApp, and AI Calling—all in one unified dashboard[cite: 46].
          </p>
        </div>
      </div>
    </div>
  );
}