"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Eye, EyeOff, Send } from "lucide-react"; // เพิ่ม Send เข้ามาตกแต่งค่ะ
import { useMarineContext } from "../context/marineContext";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { userData, setUserData } = useMarineContext();

  // --- ส่วนที่เพิ่มใหม่สำหรับระบบลืมรหัสผ่าน ---
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("กรุณากรอก Username เพื่อแจ้งลืมรหัสผ่านค่ะ");
      return;
    }
    setError(""); // เคลียร์ error เก่า
    setShowForgotMsg(true);
    // ตั้งเวลาให้ข้อความหายไปเองหลังจาก 5 วินาที
    setTimeout(() => setShowForgotMsg(false), 5000);
  };
  // ---------------------------------------

  useEffect(() => {
    setMounted(true);
    const user = sessionStorage.getItem("marineford_user");
    if (user) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid username or password. Please try again.");
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem("marineford_user", data.user?.email ?? username.toLowerCase());
      setUserData(data.user);
      router.replace("/");
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden font-sans">
      <div className={`bg-white border border-slate-200 rounded-3xl p-8 sm:p-11 w-full max-w-[440px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 transition-all duration-700 ease-out mx-4 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Header */}
        <div className="text-center mb-9">
          <div className="flex items-center justify-center w-[72px] h-[72px] mx-auto mb-4 drop-shadow-[0_8px_24px_rgba(74,144,226,0.3)] animate-float relative">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
              <circle cx="24" cy="24" r="22" fill="url(#anchorGrad)" />
            </svg>
            <Anchor className="w-10 h-10 text-black relative z-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-blue-600 tracking-tight mb-2">
            Marineford
          </h1>
          <p className="text-[13px] text-slate-500 font-medium tracking-wide m-0">
            Fleet &amp; Incident Monitoring System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-[13px] font-semibold text-slate-900">
              Username
            </label>
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-slate-900/40 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="w-full bg-white/5 border border-gray-400 rounded-xl py-3 px-11 text-sm text-slate-900 outline-none transition-all duration-300 placeholder-white/30 focus:border-blue-500 focus:bg-blue-500/10 focus:ring-[3px] focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[13px] font-semibold text-slate-900 tracking-wide">
                Password
              </label>
              {/* --- ปุ่มกดลืมรหัสผ่านที่เพิ่มเข้ามา --- */}
              <button 
                onClick={handleForgotPassword}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                type="button"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-slate-900/40 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full bg-white/5 border border-gray-400 rounded-xl py-3 px-11 text-sm text-black outline-none transition-all duration-300 placeholder-white/30 focus:border-blue-500 focus:bg-blue-500/10 focus:ring-[3px] focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3.5 bg-transparent border-none text-black cursor-pointer flex items-center p-0 transition-colors duration-200 hover:text-white/80"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {/* แจ้งเตือนเมื่อส่งคำร้องไปที่ส่วนกลาง */}
          {showForgotMsg && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg py-2.5 px-3.5 text-blue-700 text-[13px] animate-fade-in-up" role="status">
              <Send size={16} className="shrink-0" />
              <span>ส่งคำร้องไปที่ส่วนกลาง (HQ) เรียบร้อยแล้วค่ะ โปรดรอการดำเนินการ</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-lg py-2.5 px-3.5 text-red-600 text-[13px] animate-fade-in-up" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button id="login-btn" type="submit" className="w-full p-3.5 border-none rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 text-white text-[15px] font-bold cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(74,144,226,0.45)] tracking-wide mt-1 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(74,144,226,0.55)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2.5">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                Authenticating...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-7 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-500 uppercase tracking-[1px] mb-2.5">Demo credentials</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-500/45 bg-white/5 py-1 px-2.5 rounded-md border border-white/5"><strong className="text-gray-500/70 font-semibold">admin</strong> / admin123</span>
            <span className="text-xs text-gray-500/45 bg-white/5 py-1 px-2.5 rounded-md border border-white/5"><strong className="text-gray-500/70 font-semibold">officer</strong> / officer123</span>
            <span className="text-xs text-gray-500/45 bg-white/5 py-1 px-2.5 rounded-md border border-white/5"><strong className="text-gray-500/70 font-semibold">captain</strong> / captain123</span>
          </div>
        </div>
      </div>
    </div>
  );
}