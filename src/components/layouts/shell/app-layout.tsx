"use client";
import { Toaster } from "@/components/ui/sonner";
// import { Toaster } from "sonner";
// import { Toaster } from "@/components/ui/toaster";
import BottomNav from "./bottom-nav";
import TopNav from "./top-nav";
import Script from "next/script";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
          </Script>
        </>
      )}
      <div>
        <Toaster position="top-right" />
        <TopNav />
        {children}
        <BottomNav />
      </div>
    </>
  );
};
export default AppLayout;
