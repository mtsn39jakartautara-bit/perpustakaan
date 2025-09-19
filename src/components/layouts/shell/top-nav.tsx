"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Search, Sun, Moon } from "lucide-react";

const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implement dark mode logic here
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card backdrop-blur-md border-b border-border shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo/Nama Aplikasi */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                S
              </span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              SweetApp
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Search size={20} className="text-secondary-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-accent hover:bg-accent/80 transition-colors relative"
            >
              <Bell size={20} className="text-accent-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-destructive-foreground text-xs">3</span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-muted-foreground" />
              ) : (
                <Moon size={20} className="text-muted-foreground" />
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent cursor-pointer"
            />
          </nav>

          {/* Mobile Menu Button */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-muted"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button> */}
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-popover shadow-lg z-50 md:hidden"
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      S
                    </span>
                  </div>
                  <h2 className="text-lg font-bold">SweetApp</h2>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-full bg-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="p-6 space-y-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-secondary text-left"
                >
                  <Search size={20} />
                  <span>Search</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-accent text-left"
                >
                  <Bell size={20} />
                  <span>Notifications</span>
                  <span className="ml-auto bg-destructive text-destructive-foreground rounded-full px-2 py-1 text-xs">
                    3
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={toggleDarkMode}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-muted text-left"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </motion.button>

                <div className="pt-4 border-t border-border">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-foreground/20" />
                    <span>My Profile</span>
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
