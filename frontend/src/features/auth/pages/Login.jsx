import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);
    const [error, setError] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useAuth();



const handleSubmit = async (e) => {
  e.preventDefault();

  const playLoad = {
    email,
    password,
  };

  setError("");

  try {
    const response = await handleLogin(playLoad);

    console.log("Login response:", response);

    if (response?.success) {
      setEmail("");
      setPassword("");

      
    }
  } catch (error) {
      const errorData = error.response?.data;
          if (errorData?.errors?.length > 0) {
      setError(errorData.errors[0].message);
    } else {
      setError(
        errorData?.message ||
        error.message ||
        "Something went wrong."
      );
    }

  }
};

  const GoogleLogin = () => {
    window.location.href =  `https://perplexity-rihg.onrender.com/api/auth/google`; 
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fffff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_-15px_rgba(27,35,64,0.15)] p-6 md:p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-6">
          <img
            src="./login.png"
            alt="Brain Blitz - AI learning assistant"
            className="w-full max-w-[380px] h-auto object-contain"
          />

          <div className="text-center max-w-xs">
            <p className="text-lg font-semibold text-[#1B2340] leading-snug">
              Ask Anything.
              <br />
              Get Intelligent Answers.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Search, understand, and explore with AI-powered answers.
            </p>
          </div>
        </div>

        {/* RIGHT — Login Form */}
        <div className="flex-1 w-full max-w-sm">
          {/* Logo top-center */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src="./logo.png"
              alt="Brain Blitz"
              className="w-11 h-11 object-contain mb-4"
            />
            <h1 className="text-2xl font-semibold text-[#1B2340]">
              Welcome back to Brain Blitz
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Ask anything. Discover clear, intelligent answers.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={GoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-slate-700 text-sm font-medium hover:bg-slate-50 transition mb-5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.7 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.9 39.7 16.4 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C40.5 36.4 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or log in with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-[#1B2340] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-4 py-2 pr-12 rounded-lg border border-slate-200 text-[#1B2340] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#F97316] transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#C81E78] focus:ring-[#C81E78]/40"
                />
                Remember me
              </label>
              <button onClick={() => navigate("/forget-password")}
                type="button"
                className="text-[#FF8A00] hover:text-[#F4511E] font-medium transition cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="text-sm text-rose-500 mb-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-sm bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span className="animate-pulse">Logging in...</span>
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#FF8A00] hover:text-[#F4511E] font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
