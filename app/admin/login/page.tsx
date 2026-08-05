"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { loginAction } from "./actions";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    const result = await loginAction(data.password);
    
    if (result.success) {
      router.push("/admin");
    } else {
      setAuthError(result.error || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#F8F5F0]">
      {/* Card Container */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-neutral-200/80 space-y-6">
        
        {/* Branding & Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-neutral-100 p-3.5 rounded-full inline-flex items-center justify-center border border-neutral-200/60 shadow-inner text-neutral-600">
            <Lock className="size-6" strokeWidth={1.5} />
          </div>
          
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-medium tracking-tight text-neutral-900">
              Welcome Back
            </h1>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
              NAILVIBE • ADMIN STUDIO
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full border border-neutral-200/50">
            <ShieldCheck size={12} className="text-neutral-500" />
            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
              Secure Access
            </span>
          </div>
        </div>

        {/* Enhanced Form UI */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-neutral-500">
              Master Password
            </label>
            
            {/* Input Field & Icon Fix */}
            <div className="relative w-full flex items-center">
              {/* Left Lock Icon */}
              <Lock className="absolute left-4 size-4 text-neutral-400 pointer-events-none z-10" />
              
              {/* Input Element */}
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter master password..."
                className={`w-full pl-11 pr-11 py-3.5 bg-neutral-50/80 border ${
                  errors.password || authError ? "border-red-300 focus:ring-red-100" : "border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                } rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white outline-none transition-all`}
              />
              
              {/* Right Eye Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-neutral-400 hover:text-neutral-800 transition-colors z-10 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            
            {/* Validation & Error States */}
            {(errors.password || authError) && (
              <p className="text-xs text-red-500 font-medium ml-1 mt-1">
                {errors.password?.message || authError}
              </p>
            )}
          </div>

          {/* High-Contrast Primary Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-black text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="flex justify-center pt-2">
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
          >
            <ArrowLeft size={12} /> Back to Live Store
          </Link>
        </div>

      </div>
    </div>
  );
}
