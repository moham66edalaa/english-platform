import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#f5f0e8] font-serif mb-3">Reset Password</h1>
        <p className="text-[#9ca3af]">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            className="w-full rounded-2xl border border-[#2a2e37] bg-[#1a1e28] px-6 py-4 text-lg text-[#f5f0e8] placeholder-[#6b7280] transition-all focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c]"
          />
        </div>

        <Button className="w-full rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#e8cc80] py-7 text-lg font-bold text-[#0d0f14] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-12 flex justify-center">
        <Link href="/login" className="group flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#f5f0e8] transition-colors">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </Link>
      </div>
    </div>
  )
}