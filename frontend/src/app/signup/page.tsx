"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(email, password, fullName, "customer");
      router.push("/setup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (!tokenResponse.access_token) {
          throw new Error("No Google access token returned");
        }
        await loginWithGoogle(tokenResponse.access_token);
        router.push("/setup");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Google signup failed");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setIsGoogleLoading(false);
      setError("Google Signup Failed. Please try again.");
    },
    onNonOAuthError: () => {
      setIsGoogleLoading(false);
    }
  });

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    googleSignup();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black antialiased font-sans">
      {/* Left Side: Form */}
      <div className="relative flex w-full flex-col justify-between p-6 md:w-1/2 lg:p-8">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <Link href="/" className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
            <img src="/logo.png" alt="Vero Logo" className="h-5 w-auto" />
            Vero
          </Link>
          
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            You are signing into <span className="text-white font-black">Vero</span>
          </div>
        </div>

        {/* Center Form */}
        <div className="mx-auto w-full max-w-[340px]">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight">Get started</h1>
            <p className="mt-3 text-[13px] text-zinc-500">Create a new account</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-3 text-[13px] text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Full Name</label>
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-white/5 bg-zinc-900/40 p-3 text-sm transition-all focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 placeholder:text-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/5 bg-zinc-900/40 p-3 text-sm transition-all focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 placeholder:text-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Password</label>
              <div className="relative group">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/5 bg-zinc-900/40 p-3 pr-10 text-sm transition-all focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 placeholder:text-zinc-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button
                id="signup-submit"
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-zinc-800/80 py-3.5 text-sm font-bold transition-all hover:bg-zinc-700 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-black px-3 text-zinc-600">Or</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/5 bg-white/5 py-3 text-xs font-bold transition-all hover:bg-white/10 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <span className="flex items-center gap-2 italic">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Connecting...
                  </span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0 overflow-visible">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[12px] text-zinc-500">
            Have an account?{" "}
            <Link href="/login" className="font-bold text-white hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative hidden w-1/2 overflow-hidden border-l border-white/10 bg-zinc-950 md:block">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: 'url("/signupbg.png")' }}
        />
        
        <div className="relative z-10 flex h-full flex-col justify-end p-12">
          <div className="max-w-[340px]">
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tight">Expertise matched with global companies.</h2>
            <p className="mt-4 text-[13px] text-zinc-500">The network for top-tier autonomous workforce management.</p>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-80" />
      </div>
    </div>
  );
}
