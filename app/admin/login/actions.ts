"use server";
import { cookies } from "next/headers";

export async function loginAction(password: string) {
  // Hardcoded MVP secret
  if (password === "nailvibe2026") {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "admin_secret_token_123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  
  // Artificial delay for premium loading feel
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: false, error: "Invalid password" };
}
