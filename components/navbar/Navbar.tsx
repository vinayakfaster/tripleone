"use client";

import { useEffect, useState } from "react";
import { SafeUser } from "@/types";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import MainSearch from "./MainSearch";
import CompactSearch from "./CompactSearch";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  currentUser?: SafeUser | null;
}

function Navbar({ currentUser }: Props) {
  const [showCompact, setShowCompact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setShowCompact(window.scrollY > 80);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed w-full bg-white z-50 shadow-sm transition-all duration-300">
      <div className="py-4 border-b">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center items-center min-w-0">
              <AnimatePresence mode="wait">
                {(showCompact || isMobile) ? (
                  <motion.div
                    key="compact"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <CompactSearch />
                  </motion.div>
                ) : (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <MainSearch />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative z-50">
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>

      {/* Categories bar */}
      <div className="relative z-10">
        <Categories />
      </div>
    </div>
  );
}

export default Navbar;
