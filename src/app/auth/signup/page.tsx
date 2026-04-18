"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { apiUrl } from "@/libs/apiUrl";

export default function SignUp() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/api/v1/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          telephone: phoneNumber,
          name: name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/signin");
      }

      // return await response.json()
    } catch (error: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center text-center">
      {/* Background Image */}
      <img
        src="/img/8.png"
        alt="background"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center scale-110"
        style={{
          filter: "blur(8.8px) brightness(0.6)",
          opacity: 1,
        }}
      />

      {/* Sign Up Card */}
      <div className="w-full max-w-2xl">
        <div
          className="rounded-3xl bg-white shadow-2xl p-10"
          style={{
            background: "white",
            border: "8px solid transparent",
            backgroundImage:
              "linear-gradient(white, white), linear-gradient(135deg, #73683B, #D9C89C)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <h1 className="text-4xl font-bold text-center mb-10 text-[#73683B]">
            Create your account
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="text-left block text-sm font-medium text-[#3D220F] mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9C89C] focus:border-transparent"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="text-left block text-sm font-medium text-[#3D220F] mb-2"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9C89C] focus:border-transparent"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="text-left block text-sm font-medium text-[#3D220F] mb-2"
              >
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
              <label
                htmlFor="password"
                className="text-left block text-sm font-medium text-[#3D220F] mb-2"
              >
                Password
              </label>
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

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-left block text-sm font-medium text-[#3D220F] mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9C89C] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#877959] hover:text-[#59200D]"
                >
                  {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#D9C89C] to-[#877959] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 mt-8 text-center"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <span className="text-[#59200D]">
              Already Have An Account ?{" "}
              <Link
                href="/auth/signin"
                className="text-[#A76438] hover:text-[#59200D] font-semibold transition"
              >
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
