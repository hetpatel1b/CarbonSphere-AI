"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { Leaf, Loader2, Eye, EyeOff, ShieldCheck, CheckCircle2, Lock, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const registerPromise = authService.register(data.name, data.email, data.password);

    toast.promise(registerPromise, {
      loading: "Creating account...",
      success: () => {
        router.push('/login');
        return "Account created successfully";
      },
      error: (err: Error | unknown) => {
        setError((err as Error).message || 'An error occurred during registration');
        return "Registration failed";
      }
    });

    try {
      setIsLoading(true);
      setError('');
      await registerPromise;
    } catch (err: unknown) {
      // Handled in toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-row-reverse">
      {/* LEFT SIDE: Marketing Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-zinc-950 border-l border-zinc-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />
        </div>

        <div className="relative z-10 text-right">
          <Link href="/" className="inline-flex flex-row-reverse items-center gap-3 font-bold text-white mb-20 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/20">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl tracking-tight">CarbonSphere AI</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-end text-right">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Track. Analyze. Reduce.
            </h1>
            <p className="text-xl text-zinc-400 mb-12 max-w-md">
              AI-powered sustainability intelligence for the next generation.
            </p>

            <div className="space-y-6 flex flex-col items-end">
              {[
                "Groq AI Sustainability Coach",
                "Real-Time Carbon Analytics",
                "Predictive Forecasting",
                "Sustainability Marketplace",
                "Community Challenges"
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-center gap-4 text-zinc-300 flex-row-reverse"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-zinc-500 font-medium text-right">
          &copy; {new Date().getFullYear()} CarbonSphere AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span>CarbonSphere</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] space-y-8"
        >
          <div className="bg-zinc-900/50 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
              <p className="text-zinc-400">Join CarbonSphere AI and start tracking</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  data-testid="register-name-input"
                  className="w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  data-testid="register-email-input"
                  className="w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    data-testid="register-password-input"
                    className="w-full px-4 py-3 pr-12 border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    data-testid="register-confirm-password-input"
                    className="w-full px-4 py-3 pr-12 border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  data-testid="register-submit-button"
                  className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}
                </Button>
              </div>
            </form>
            
            <p className="text-center text-sm text-zinc-400 mt-8">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-white hover:text-teal-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-center text-zinc-500">
            <p className="text-xs uppercase tracking-widest font-semibold mb-4">Protected By</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-zinc-600" /> JWT Authentication</div>
              <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-zinc-600" /> Encrypted Credentials</div>
              <div className="flex items-center gap-1.5"><Server className="w-4 h-4 text-zinc-600" /> Secure Infrastructure</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
