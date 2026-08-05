import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");
  
  // Hardcoded MVP secret
  if (password === "nailvibe2026") {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "admin_secret_token_123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    redirect("/admin");
  }
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-mist] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 pb-6 text-center bg-[--color-obsidian] text-white">
          <Lock className="mx-auto mb-4 opacity-80" size={32} />
          <h1 className="text-2xl font-display tracking-tight">Admin Portal</h1>
          <p className="text-sm opacity-70 mt-1">Authorized personnel only</p>
        </div>
        <form action={login} className="p-8 pt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-[--color-obsidian]">
              Master Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-chrome bg-mist/30 focus:outline-none focus:ring-2 focus:ring-obsidian focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[--color-lacquer] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Authenticate <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
