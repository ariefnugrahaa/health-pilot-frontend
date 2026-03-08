"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/core/stores/auth.store";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Redirect authenticated users away from login page
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      // User is already logged in, redirect them
      if (redirect === "/" || redirect === "/login") {
        router.push("/dashboard");
      } else {
        router.push(redirect);
      }
    }
  }, [mounted, isAuthenticated, router, redirect]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({ email, password });

      // Redirect to appropriate page after login
      if (redirect === "/" || redirect === undefined || redirect === null) {
        // Default to dashboard after login
        router.push("/");
      } else {
        // Use the specified redirect URL (from "Save / Continue Later")
        router.push(redirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  // Show loading while checking auth or redirecting
  if (!mounted || isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#effefb] border-t-[#14b8a6] animate-spin" />
          <p className="text-[#667085] font-medium">
            {isAuthenticated ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-[#14b8a6] rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10-4.48 10S17.52 2 12 12 12-5.373 12-12S18.627 0 12 0zm0 18c-4.41 0-8-3.59-8s3.59-8 8 3.59 8 8 3.59 8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm5 0c.83 0 1.5-.67 1.5-1.5S12.83 8 12 8s-1.5.67-1.5 1.5S16.17 11 17 11zm5 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5S16.17 11 17 11z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-800">HEALTH PILOT</span>
          </div>
          <p className="text-sm text-gray-500">Guidance you can act on.</p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome back</h1>
          <p className="text-gray-600 text-center mb-8">
            Access your saved health summaries and continue where you left off.
          </p>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-12 h-12 rounded-lg border-gray-300 p-0 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                />
                <path
                  fill="#34A853"
                  d="M16.0407269,18.0125889 C14.950916,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                />
                <path
                  fill="#4A90E2"
                  d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7## 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-12 h-12 rounded-lg border-gray-300 p-0 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.315 19.802c-.688 1.7-2.022 2.198-3.315 2.198-2.072 0-3.757-1.7-3.757-3.8 0-2.1 1.685-3.8 3.757-3.8 2.073 0 3.758 1.7 3.758 3.8 0 .562-.12 1.1-.342 1.602-.366.8-1.103 1.267-1.898 1.267-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878.197 0 .385.04.55.112.55.045.18-.563 1.12-.563 1.416 0 .052-.018.104-.06.155-.06.197 0 .552-.933.852-1.99.852-1.416 0-.052.004-.104.006-.155.006-.66 0-1.195-.393-1.195-.878 0-.484.535-.878 1.195-.878z"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-12 h-12 rounded-lg border-gray-300 p-0 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-5.373 12-12 12 5.373 12 12c0 5.99 4.388 10.954 10.125 11.854v-2.951c-.889.096-1.784.25-2.666.48-.897-.3-1.743-.685-2.482-1.12.666-2.667-.995-2.667-3.33 0-2.544 1.808-4.879 4.414-5.752-.409-.197-.795-.472-1.154-.817.585-.056 1.226-.194 1.808-.425 2.39-.383.383-.758.747-1.094 1.087-.59.029-1.155.088-1.74.088-2.396 0-.486-.146-.947-.39-1.372-.094-.247-.258-.516-.493-.793-.586-.977-.549-1.504-.549-2.399 0-1.679.454-2.767 1.091-2.767 1.524 0 .639.196 1.166.592 1.649.053.425.155.825.464 1.194.642.446.909.523 1.444.334.664.592 1.194.887-.074.25-.275.468-.549.738-.549 1.649 0 1.678-.49 2.81-1.091 2.81-1.65 0-.608-.353-1.157-.664-1.649.496-.438.893-.755 1.401-.931 1.823-.566.928-1.471 1.401-2.526 1.649-.448.252-1.074.383-1.649.383-.637 0-1.18-.506-1.649-1.412-1.492-.435-.792-.715-1.649-1.412-1.492.904 0 1.634.679 2.823 1.471 3.246.497.423.871.783 1.412 1.087.567.273 1.091.849.244.576-1.24.728-1.492-1.29.609.527.914.779 1.524.779 2.681 0 .558.048 1.103.096 1.603.146.88.473.616.746 1.047 1.053 1.625 1.053 1.361 0 1.735-.458 1.909-.691.913-.603 1.295-.913 1.738-1.008 2.653-.095.474-.466 1.342-.646 1.963-.179.561-.381 1.093-.381 1.823 0 1.359.446 2.383 1.377 2.383.625 0 .957-.521 1.77-1.098 1.968-.417.349-.842.563-1.288.563-1.908 0-.931.318-1.736.848-2.383-1.649-.403.258-.834.403-1.649.403-1.908 0-.931.318-1.736.848-2.383-1.649-.403.258-.834.403-1.649.403-1.908z"
                />
              </svg>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              placeholder="Input email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-gray-300 focus:ring-[#14b8a6] focus:border-[#14b8a6]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Input password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-12 border-gray-300 focus:ring-[#14b8a6] focus:border-[#14b8a6]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#14b8a6] border-gray-300 rounded focus:ring-[#14b8a6]"
              />
              <span className="ml-2 text-sm text-gray-700">Keep me logged in</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[#14b8a6] hover:text-[#0d9488]"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {/* Register Link */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don&apos;t have an account?</span>
            <Link
              href="/register"
              className="ml-2 text-sm text-[#14b8a6] hover:text-[#0d9488] font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="flex-1 bg-[#F0FDF9] flex flex-col items-center justify-center px-8">
        <div className="text-center">
          <div className="w-64 h-64 bg-white/50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#14b8a6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#14b8a6]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm5 0c.83 0 1.5-.67 1.5-1.5S12.83 8 12 8s-1.5.67-1.5 1.5S11.17 11 12 11zm5 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5S16.17 11 17 11z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Track your health</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Save your health progress</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Keep your health summaries, patterns, and next steps in one place — accessible anytime, from any device.
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-3 h-3 bg-[#14b8a6] rounded-full"></div>
          <div className="w-3 h-3 bg-[#14b8a6]/30 rounded-full"></div>
          <div className="w-3 h-3 bg-[#14b8a6]/30 rounded-full"></div>
          <div className="w-3 h-3 bg-[#14b8a6]/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
