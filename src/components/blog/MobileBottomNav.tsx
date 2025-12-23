"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPath?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/blog",
    label: "Home",
    matchPath: "/blog",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/blog/reading-list",
    label: "Saved",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "#search",
    label: "Search",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: "/",
    label: "Portfolio",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const lastScrollY = useRef(0);

  // Hide/show based on scroll direction
  useEffect(() => {
    let ticking = false;
    const scrollThreshold = 10;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - lastScrollY.current;

          if (Math.abs(scrollDiff) > scrollThreshold) {
            if (scrollDiff > 0 && currentScrollY > 100) {
              setIsVisible(false);
            } else if (scrollDiff < 0) {
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.matchPath) {
      return pathname === item.matchPath;
    }
    return pathname === item.href;
  };

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.href === "#search") {
      e.preventDefault();
      setShowSearch(true);
      // Focus the command bar search if it exists
      const searchInput = document.querySelector(".command-bar-trigger") as HTMLElement;
      if (searchInput) {
        searchInput.click();
      }
    }
  };

  return (
    <>
      <motion.nav
        className="mobile-bottom-nav"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ duration: 0.2 }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Component = item.href.startsWith("#") ? "button" : Link;

          return (
            <Component
              key={item.href}
              href={item.href as string}
              onClick={(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => handleNavClick(item, e)}
              className={`mobile-nav-item ${active ? "active" : ""}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
              {active && (
                <motion.span
                  className="mobile-nav-indicator"
                  layoutId="mobileNavIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Component>
          );
        })}
      </motion.nav>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="mobile-nav-spacer" />
    </>
  );
}
