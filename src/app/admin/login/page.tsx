"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setError("Invalid password");
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="bg-obsidian min-h-screen flex items-center justify-center px-6">
      <div className="bg-charcoal p-12 w-full max-w-[420px]">
        <h1 className="font-cormorant text-[28px] text-ivory tracking-[0.3em] uppercase text-center">
          The Harlen
        </h1>
        <div className="w-12 h-px bg-gold mx-auto my-6" />
        <p className="font-dm-sans text-[12px] text-ivory/40 tracking-[0.2em] uppercase text-center mb-10">
          Admin Portal
        </p>

        <div>
          <label className="block font-dm-sans text-[9px] tracking-[0.25em] text-gold uppercase mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="border-b border-linen/30 focus:border-gold bg-transparent text-ivory font-dm-sans text-[15px] py-3 w-full outline-none transition-colors"
          />
          {error && (
            <p className="font-dm-sans text-[12px] text-red-400 mt-3">{error}</p>
          )}
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="w-full mt-8 bg-gold text-obsidian py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-gold-light transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </main>
  );
}
