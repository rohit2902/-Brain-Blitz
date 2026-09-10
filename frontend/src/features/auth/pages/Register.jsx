import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { user} = useSelector((state) => state.auth);

 

  const navigate = useNavigate();
  const { handleRegister, loading , showVerifyModal, setShowVerifyModal, registeredEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    try {
      await handleRegister({ name, email, password });
     
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

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const GoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`; 
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center  ">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_-15px_rgba(27,35,64,0.15)] p-2 md:p-5 flex flex-col md:flex-row items-center gap-10">
        {/* LEFT — AI Illustration */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-6">
          <BrainBlitzIllustration />

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

        {/* RIGHT — Registration Form */}
        <div className="flex-1 w-full max-w-sm">
          {/* Logo top-center */}
          <div className="flex flex-col items-center text-center mb-2">
            <img
              src="./logo.png"
              alt="Brain Blitz"
              className="w-11 h-11 object-contain "
            />
            <h1 className="text-2xl font-semibold text-[#1B2340]">
              Welcome to Brain Blitz
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Ask anything. Discover clear, intelligent answers.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={GoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 transition mb-2 mt-5 cursor-pointer"
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
            <span className="text-xs text-slate-400">
              or register with email
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-[#1B2340] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div>
              <label className="block text-sm text-slate-700 mb-1">
                Confirm password <span className="text-rose-500">*</span>
              </label>
              <div></div>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-[#1B2340] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-sm bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span className="animate-pulse">Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#FF8A00] hover:text-[#F4511E] font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <svg
                className="h-8 w-8 text-[#FF6B00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-slate-800">
              Check your email
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-slate-500">
              We've sent a verification link to
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {registeredEmail}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Please check your inbox and click the verification link to
              activate your account.
            </p>

            {/* Gmail Button */}
            <button
              type="button"
              onClick={() => {
                window.open("https://mail.google.com", "_blank");
              }}
              className="mt-6 w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-90 transition"
            >
              Go to Gmail
            </button>

            {/* Later */}
            <button
              type="button"
              onClick={() => setShowVerifyModal(false)}
              className="mt-4 text-sm text-slate-500 hover:text-slate-700"
            >
              I'll verify later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Custom AI illustration (no external assets, no borrowed branding) ---
const BrainBlitzIllustration = () => {
  return (
    <svg
      viewBox="0 0 420 380"
      className="w-full max-w-[380px] h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bbAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B2340" />
          <stop offset="100%" stopColor="#8B2FC9" />
        </linearGradient>
        <linearGradient id="bbCard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FBF7FC" />
        </linearGradient>
        <radialGradient id="bbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind everything */}
      <circle cx="210" cy="150" r="140" fill="url(#bbGlow)" />

      {/* Connector lines — question to answer */}
      <path
        d="M120 240 C 150 190, 180 160, 210 150"
        stroke="url(#bbAccent)"
        strokeWidth="2"
        strokeDasharray="4 6"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M300 200 C 270 175, 240 160, 210 150"
        stroke="url(#bbAccent)"
        strokeWidth="2"
        strokeDasharray="4 6"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M330 260 C 290 220, 250 180, 210 150"
        stroke="url(#bbAccent)"
        strokeWidth="2"
        strokeDasharray="4 6"
        fill="none"
        opacity="0.5"
      />

      {/* Small floating card: Search */}
      <g transform="translate(60,150)">
        <rect
          width="88"
          height="46"
          rx="10"
          fill="url(#bbCard)"
          stroke="#F0DDEB"
        />
        <circle
          cx="18"
          cy="23"
          r="7"
          fill="none"
          stroke="#8B2FC9"
          strokeWidth="2"
        />
        <line
          x1="23"
          y1="28"
          x2="29"
          y2="34"
          stroke="#8B2FC9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="38"
          y="27"
          fontSize="10"
          fill="#1B2340"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Search
        </text>
      </g>

      {/* Small floating card: Sources */}
      <g transform="translate(290,160)">
        <rect
          width="90"
          height="46"
          rx="10"
          fill="url(#bbCard)"
          stroke="#F0DDEB"
        />
        <rect
          x="14"
          y="14"
          width="14"
          height="18"
          rx="2"
          fill="none"
          stroke="#C81E78"
          strokeWidth="1.6"
        />
        <rect
          x="20"
          y="18"
          width="14"
          height="18"
          rx="2"
          fill="none"
          stroke="#C81E78"
          strokeWidth="1.6"
        />
        <text
          x="42"
          y="27"
          fontSize="10"
          fill="#1B2340"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Sources
        </text>
      </g>

      {/* Small floating card: Reasoning */}
      <g transform="translate(300,232)">
        <rect
          width="96"
          height="46"
          rx="10"
          fill="url(#bbCard)"
          stroke="#F0DDEB"
        />
        <path
          d="M16 30 C16 18, 30 18, 30 26 C30 32, 24 30, 24 34"
          fill="none"
          stroke="#EA580C"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="24" cy="38" r="1.6" fill="#EA580C" />
        <text
          x="40"
          y="27"
          fontSize="10"
          fill="#1B2340"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Reasoning
        </text>
      </g>

      {/* Central glowing brain node */}
      <g transform="translate(196,116)">
        <circle cx="14" cy="14" r="20" fill="url(#bbAccent)" opacity="0.15" />
        <path
          d="M14 3 C8 3, 4 7, 4 12 C4 13.5, 4.5 15, 5.5 16 C4.5 17, 4 18.5, 4 20 C4 24.5, 8 27, 12 26.5 C13 27.5, 14.5 28, 16 27.5 C20 27, 22 23.5, 21.5 20 C23 18.5, 24 16.5, 24 14 C24 8, 19.5 3, 14 3 Z"
          fill="none"
          stroke="url(#bbAccent)"
          strokeWidth="1.8"
        />
        <line
          x1="14"
          y1="7"
          x2="14"
          y2="24"
          stroke="url(#bbAccent)"
          strokeWidth="1.2"
          opacity="0.6"
        />
      </g>

      {/* Sparkles */}
      <g fill="#C81E78">
        <path
          d="M340 110 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"
          opacity="0.8"
        />
        <path d="M78 110 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" opacity="0.6" />
        <path d="M235 90 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" opacity="0.7" />
      </g>

      {/* Central AI answer card */}
      {/* <g transform="translate(0,250)">
        <rect
          width="180"
          height="90"
          rx="16"
          fill="white"
          stroke="#F0DDEB"
          strokeWidth="1.5"
        />
        <rect x="16" y="18" width="10" height="10" rx="3" fill="url(#bbAccent)" />
        <text x="34" y="27" fontSize="11" fill="#1B2340" fontFamily="sans-serif" fontWeight="700">
          Brain Blitz AI
        </text>
        <text x="16" y="48" fontSize="10" fill="#4B5563" fontFamily="sans-serif">
          Generating intelligent
        </text>
        <text x="16" y="62" fontSize="10" fill="#4B5563" fontFamily="sans-serif">
          answer...
        </text>
        <rect x="16" y="72" width="120" height="5" rx="2.5" fill="#F3E4EF" />
        <rect x="16" y="72" width="78" height="5" rx="2.5" fill="url(#bbAccent)" />
      </g> */}

      {/* Laptop with typed question */}
      <g transform="translate(60,240)">
        <rect x="0" y="0" width="130" height="82" rx="8" fill="#1B2340" />
        <rect x="7" y="7" width="116" height="62" rx="4" fill="#FDF2F8" />
        <circle cx="18" cy="20" r="4" fill="url(#bbAccent)" />
        <rect x="28" y="17" width="70" height="6" rx="3" fill="#E4C6DA" />
        <rect
          x="16"
          y="34"
          width="98"
          height="18"
          rx="9"
          fill="white"
          stroke="#E4C6DA"
        />
        <text x="24" y="46" fontSize="9" fill="#6B7280" fontFamily="sans-serif">
          What is Brain Blitz?
        </text>
        <rect x="-6" y="82" width="142" height="8" rx="4" fill="#0F1730" />
      </g>
    </svg>
  );
};

export default Register;
