"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, User, LibraryBigIcon } from "lucide-react";
import SearchModal from "@/components/SearchModal";

const BottomNav = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    {
      path: "/",
      icon: Home,
    },
    {
      path: "/libraries",
      icon: LibraryBigIcon,
    },
    {
      path: "/explore",
      icon: Search,
      isSpecial: true,
      onClick: () => setIsSearchOpen(true), // Tambahkan handler onClick khusus
    },
    {
      path: "/history",
      icon: Bookmark,
    },
    {
      path: "/profile",
      icon: User,
    },
  ];

  const handleItemClick = (item: any) => {
    if (item.onClick) {
      item.onClick(); // Jalankan onClick jika ada
    } else {
      setActiveItem(item.path); // Set active item untuk navigasi biasa
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 z-40">
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
                <div
                  key={index}
                  className="relative flex items-center justify-center"
                >
                  {item.isSpecial ? (
                    // Special button untuk Explore dengan onClick
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleItemClick(item)}
                      className="p-3 rounded-xl flex flex-col items-center justify-center text-white"
                    >
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        className="relative z-10 p-2 rounded-full bg-primary"
                        style={{
                          background: "var(--gradient-hero)",
                          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <Icon
                          size={22}
                          className="relative z-10"
                          strokeWidth={2}
                        />
                      </motion.div>
                    </motion.button>
                  ) : (
                    // Regular navigation items
                    <Link
                      href={item.path}
                      onClick={() => handleItemClick(item)}
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

                        <Icon
                          size={22}
                          className={`relative z-10 ${
                            isActive ? "text-primary-foreground" : ""
                          }`}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                      </motion.div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </motion.nav>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default BottomNav;
