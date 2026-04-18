"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        router.push("/")
        router.refresh()
      }
    } catch (error: any) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center text-center">
      {/* Background Image */}
      
    <img
        src="/img/8.png"
        alt="background"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center scale-110 "
        style={{
          filter: "blur(8.8px) brightness(0.6)",
          opacity: 1,
        }}
      />
      
      

      {/* Login Card */}
      <div className="w-full max-w-2xl">
        <div 
          className="rounded-3xl bg-white shadow-2xl p-10"
          style={{
            background: "white",
            border: "8px solid transparent",
            backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #73683B, #D9C89C)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <h1 className="text-4xl font-bold text-center mb-10 text-[#73683B]">
            Login to your account
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-left block text-sm font-medium text-[#3D220F] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9C89C] focus:border-transparent"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-left block text-sm font-medium text-[#3D220F]">
                  Password
                </label>
              
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9C89C] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#877959] hover:text-[#59200D]"
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#D9C89C] to-[#877959] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 mt-8 text-center"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <span className="text-[#59200D]">
              Don't Have An Account ?{" "}
              <Link href="/auth/signup" className="text-[#A76438] hover:text-[#59200D] font-semibold transition">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
