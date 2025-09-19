"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, User, LibraryBigIcon } from "lucide-react";

const BottomNav = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Buku",
      path: "/create",
      icon: LibraryBigIcon,
    },
    {
      name: "Explore",
      path: "/explore",
      icon: Search,
      isSpecial: true,
    },

    {
      name: "Saved",
      path: "/saved",
      icon: Bookmark,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 z-50">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card backdrop-blur-md bg-opacity-90 border border-border rounded-2xl shadow-lg p-2 max-w-md w-full"
      >
        <div className="flex justify-between items-center relative">
          {navItems.map((item, index) => {
            const isActive = activeItem === item.path;
            const Icon = item.icon;

            return (
              <Link
                href={item.path}
                key={index}
                onClick={() => setActiveItem(item.path)}
                className="relative flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Background highlight for active item */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-primary rounded-xl"
                      style={{ borderRadius: "12px" }}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}

                  {/* Special styling for the center button */}
                  {item.isSpecial ? (
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      className="relative z-10 p-1 rounded-full bg-primary text-white"
                    >
                      <Icon
                        size={22}
                        className="relative z-10"
                        strokeWidth={2}
                      />
                    </motion.div>
                  ) : (
                    <Icon
                      size={22}
                      className={`relative z-10 ${
                        isActive ? "text-primary-foreground" : ""
                      }`}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  )}

                  {/* Label with animation */}
                  {/* <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium mt-1 relative z-10"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence> */}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default BottomNav;
