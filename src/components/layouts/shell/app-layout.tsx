"use client";
import { Toaster } from "@/components/ui/sonner";
// import { Toaster } from "sonner";
// import { Toaster } from "@/components/ui/toaster";
import BottomNav from "./bottom-nav";
import TopNav from "./top-nav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Toaster position="top-right" />
      <TopNav />
      {children}
      <BottomNav />
    </div>
  );
};
export default AppLayout;
