import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Mail, User, Wallet } from "lucide-react";

export default function AuthPage({ mode = "login", onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    onAuth({
      mode,
      name: name.trim(),
      email: email.trim(),
      password,
    }).catch((err) => {
      setError(err.message || "Could not authenticate user.");
    });
  };

  return (
    <main className="min-h-screen bg-[#F8F7F4] font-sans text-[#1a1714]">
      <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="bg-[#7F77DD] text-white px-6 py-8 sm:px-10 lg:px-14 lg:py-12 flex flex-col justify-between gap-12">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Wallet size={22} />
              </div>
              <span className="font-semibold text-xl">Spendly</span>
            </div>

            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100 mb-4">
                Expense tracker
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Know where your money goes, month by month.
              </h1>
              <p className="mt-5 text-sm sm:text-base leading-7 text-purple-100 max-w-lg">
                Login to manage transactions, compare income against expenses, and review your category breakdowns.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 max-w-2xl">
            <div className="border border-white/15 bg-white/10 rounded-lg p-4">
              <p className="text-2xl font-semibold">6</p>
              <p className="text-xs text-purple-100 mt-1">month graph</p>
            </div>
            <div className="border border-white/15 bg-white/10 rounded-lg p-4">
              <p className="text-2xl font-semibold">3</p>
              <p className="text-xs text-purple-100 mt-1">finance views</p>
            </div>
            <div className="border border-white/15 bg-white/10 rounded-lg p-4">
              <p className="text-2xl font-semibold">100%</p>
              <p className="text-xs text-purple-100 mt-1">focused tracking</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[380px]">
            <div className="mb-7">
              <h2 className="text-2xl font-semibold">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-sm text-[#888780] mt-2">
                {isSignup ? "Sign up to start tracking expenses." : "Login to open your dashboard."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-[#F1EFE8] rounded-lg p-1 mb-6">
              <Link
                to="/login"
                className={`h-10 rounded-md text-sm font-medium flex items-center justify-center transition-colors ${
                  !isSignup ? "bg-white text-[#1a1714] shadow-sm" : "text-[#77766f] hover:text-[#1a1714]"
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`h-10 rounded-md text-sm font-medium flex items-center justify-center transition-colors ${
                  isSignup ? "bg-white text-[#1a1714] shadow-sm" : "text-[#77766f] hover:text-[#1a1714]"
                }`}
              >
                Sign up
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <Field label="Name" icon={<User size={16} />} error={error && !name.trim()}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent py-3 text-sm focus:outline-none"
                    placeholder="Your name"
                  />
                </Field>
              )}

              <Field label="Email" icon={<Mail size={16} />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm focus:outline-none"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Password" icon={<Lock size={16} />}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm focus:outline-none"
                  placeholder="Minimum 6 characters"
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-[#FBEAF0] px-3 py-2 text-xs text-[#D4537E]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-lg text-sm font-medium bg-[#7F77DD] text-white hover:bg-[#6d65cc] transition-colors flex items-center justify-center gap-2"
              >
                {isSignup ? "Create account" : "Login"}
                <ArrowRight size={15} />
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-[#888780]">
              {isSignup ? "Already have an account? " : "New to Spendly? "}
              <Link
                to={isSignup ? "/login" : "/signup"}
                className="font-medium text-[#7F77DD] hover:text-[#6d65cc]"
              >
                {isSignup ? "Login" : "Create an account"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-[#888780] uppercase tracking-wide mb-1.5">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-white border border-[#E8E6E0] rounded-lg px-3 text-[#888780] focus-within:border-[#7F77DD] focus-within:ring-2 focus-within:ring-[#7F77DD]/15">
        {icon}
        <div className="flex-1 text-[#1a1714]">{children}</div>
      </div>
    </label>
  );
}
