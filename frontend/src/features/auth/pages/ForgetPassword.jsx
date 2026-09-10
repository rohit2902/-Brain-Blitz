import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth.js";
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { handleForgetPassword, handleVerifyForgetPassword, handleResetPassword } = useAuth();

  // Step state: 1 = Email, 2 = Verify OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(null);

  // Password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI status states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect on step 4
  useEffect(() => {
    let timer;
    if (step === 4) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, navigate]);

  // Clean transition between steps
  const goToStep = (targetStep) => {
    setErrors({});
    setGeneralError("");
    setStep(targetStep);
  };

  // Convert backend error response to field-level and general errors
  const handleApiError = (error) => {
    const errorData = error.response?.data;
    const fieldErrors = {};

    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      errorData.errors.forEach((err) => {
        if (err.field) {
          fieldErrors[err.field] = err.message;
        }
      });
      setErrors(fieldErrors);

      // If errors were returned but not mapped to fields, show general message
      if (Object.keys(fieldErrors).length === 0 && errorData.message) {
        setGeneralError(errorData.message);
      }
    } else if (errorData?.message) {
      setGeneralError(errorData.message);
    } else if (!error.response) {
      setGeneralError("Something went wrong. Please check your network connection and try again.");
    } else {
      setGeneralError("Something went wrong. Please try again.");
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const validationErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      validationErrors.email = "Please enter your email address";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        validationErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const validationErrors = {};
    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      validationErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(trimmedOtp)) {
      validationErrors.otp = "OTP must be exactly 6 digits";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const validationErrors = {};

    if (!newPassword) {
      validationErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8 || newPassword.length > 128) {
      validationErrors.newPassword = "Password must be between 8 and 128 characters";
    } else if (!/[A-Z]/.test(newPassword)) {
      validationErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
      validationErrors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(newPassword)) {
      validationErrors.newPassword = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      validationErrors.newPassword = "Password must contain at least one special character";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword && newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrors({});
    setGeneralError("");
    setMessage("");

    if (!validateStep1()) return;

    try {
      setLoading(true);
      const res = await handleForgetPassword({ email: email.trim() });
      setMessage(res?.message || "OTP has been sent to your email.");
      goToStep(2);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrors({});
    setGeneralError("");
    setMessage("");

    if (!validateStep2()) return;

    try {
      setLoading(true);
      const res = await handleVerifyForgetPassword({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (res?.data?.resetToken) {
        setResetToken(res.data.resetToken);
      }

      setMessage(res?.message || "OTP verified successfully. You can now reset your password.");
      goToStep(3);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleSubmitResetPassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrors({});
    setGeneralError("");
    setMessage("");

    if (!validateStep3()) return;

    try {
      setLoading(true);
      const res = await handleResetPassword({
        newPassword,
        confirmPassword,
        
      });

      setMessage(res?.message || "Password reset successfully");
      goToStep(4);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_-15px_rgba(27,35,64,0.12)] p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
            {step === 1 && <Mail className="w-6 h-6 text-[#FF8A00]" />}
            {step === 2 && <ShieldCheck className="w-6 h-6 text-[#FF8A00]" />}
            {step === 3 && <KeyRound className="w-6 h-6 text-[#FF8A00]" />}
            {step === 4 && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          </div>

          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Create New Password"}
            {step === 4 && "Password Reset Successful"}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            {step === 1 && "Enter your email address and we will send you a verification code."}
            {step === 2 && `Enter the 6-digit code sent to ${email || "your email"}`}
            {step === 3 && "Choose a strong password with letters, numbers, and symbols."}
            {step === 4 && "Your password has been changed successfully. You can now log in."}
          </p>
        </div>

        {/* Progress Indicator */}
        {step !== 4 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 1 ? "bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] text-white shadow-sm" : "bg-slate-100 text-slate-400"
              }`}
            >
              1
            </div>
            <div className={`w-10 h-[2px] transition-colors ${step >= 2 ? "bg-[#FF8A00]" : "bg-slate-200"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 2 ? "bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] text-white shadow-sm" : "bg-slate-100 text-slate-400"
              }`}
            >
              2
            </div>
            <div className={`w-10 h-[2px] transition-colors ${step >= 3 ? "bg-[#FF8A00]" : "bg-slate-200"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 3 ? "bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] text-white shadow-sm" : "bg-slate-100 text-slate-400"
              }`}
            >
              3
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {generalError && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="leading-snug">{generalError}</div>
          </div>
        )}

        {/* Success / Info Message Banner */}
        {message && step !== 4 && (
          <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-4 py-3 text-sm text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="leading-snug">{message}</div>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} noValidate>
            <div>
              <label htmlFor="fp-email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  if (generalError) setGeneralError("");
                }}
                placeholder="name@example.com"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition duration-150 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                }`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-95 active:scale-[0.99] disabled:opacity-60 transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending email...
                </>
              ) : (
                "Send OTP"
              )}
            </button>

            <div className="mt-5 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} noValidate>
            <div>
              <label htmlFor="fp-otp" className="block text-sm font-medium text-slate-700 mb-2">
                Verification Code
              </label>
              <input
                id="fp-otp"
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val);
                  if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                  if (generalError) setGeneralError("");
                }}
                placeholder="000000"
                disabled={loading}
                autoFocus
                className={`w-full px-4 py-3 rounded-xl border bg-white outline-none text-center tracking-[0.4em] font-mono text-xl transition duration-150 ${
                  errors.otp
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                }`}
              />
              {errors.otp && <p className="text-sm text-red-500 mt-1.5 text-center">{errors.otp}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-95 active:scale-[0.99] disabled:opacity-60 transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="text-[#FF8A00] font-medium hover:underline disabled:opacity-50 cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleSubmitResetPassword} noValidate>
            <div>
              <label htmlFor="fp-new-password" className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="fp-new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                    if (generalError) setGeneralError("");
                  }}
                  placeholder="Min. 8 characters"
                  disabled={loading}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border bg-white outline-none transition duration-150 ${
                    errors.newPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-sm text-red-500 mt-1.5">{errors.newPassword}</p>}
            </div>

            <div className="mt-4">
              <label htmlFor="fp-confirm-password" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="fp-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    if (generalError) setGeneralError("");
                  }}
                  placeholder="Re-enter new password"
                  disabled={loading}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border bg-white outline-none transition duration-150 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1.5">{errors.confirmPassword}</p>}
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-600">Password requirements:</p>
              <p>• At least 8 characters</p>
              <p>• At least one uppercase letter and one lowercase letter</p>
              <p>• At least one number and one special character</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-95 active:scale-[0.99] disabled:opacity-60 transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success & Redirect */}
        {step === 4 && (
          <div className="text-center py-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </div>

            <h2 className="text-xl font-bold text-slate-800">Password Reset Successfully!</h2>

            <p className="text-sm text-slate-500 mt-2">
              Your password has been updated. You can now use your new password to sign in.
            </p>

            <p className="text-xs text-slate-400 mt-3">
              Redirecting to login in <span className="font-semibold text-[#FF8A00]">{countdown}s</span>...
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FF9F1C] to-[#FF6B00] hover:opacity-95 active:scale-[0.99] transition duration-150 cursor-pointer shadow-sm"
            >
              Go to Login Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
