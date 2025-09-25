// components/LoginModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  School,
  Mail,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  callbackUrl: string;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  callbackUrl,
}: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && usernameRef.current) {
      setTimeout(() => usernameRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username atau email harus diisi";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      const res = await signIn("credentials", {
        redirect: false,
        login: formData.username,
        password: formData.password,
        callbackUrl: callbackUrl,
      });

      console.log(res);
      if (res?.error) {
        toast.error("Login gagal. Periksa kembali credentials Anda.");
        return;
      }
      if (res?.url) {
        window.location.href = res.url;

        // On successful login
        onClose();
        toast.success("Login berhasil!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login gagal. Periksa kembali credentials Anda.");
      setErrors({
        username: "Login gagal. Periksa kembali credentials Anda.",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              clipPath: "circle(0% at 50% 50%)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              clipPath: "circle(100% at 50% 50%)",
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              clipPath: "circle(0% at 50% 50%)",
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="relative bg-gradient-soft w-full max-w-md rounded-2xl shadow-2xl shadow-primary overflow-hidden"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Login Header */}
            <div className="p-6 bg-gradient-hero text-white text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="bg-white/20 p-3 rounded-full">
                  <BookOpen className="h-8 w-8" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold mb-2">
                Selamat Datang Kembali
              </CardTitle>
              <p className="text-white/90">
                Masuk ke akun perpustakaan MTsN 39 Anda
              </p>
            </div>

            {/* Login Form */}
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username/Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    NISN
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      ref={usernameRef}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Masukkan NISN anda"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-3 border-border focus:ring-2 focus:ring-ring"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 py-3 border-border focus:ring-2 focus:ring-ring"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    disabled={isLoading}
                  >
                    Lupa password?
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Masuk...
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>

              {/* Divider */}
              {/* <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Atau
                  </span>
                </div>
              </div> */}

              {/* Register Prompt */}
              {/* <div className="text-center">
                <p className="text-muted-foreground">
                  Belum punya akun?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    onClick={onSwitchToRegister}
                    disabled={isLoading}
                  >
                    Daftar sekarang
                  </Button>
                </p>
              </div> */}
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
