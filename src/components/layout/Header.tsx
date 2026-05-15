"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { trackNavClick, trackBookNow } from "@/lib/analytics";
import { getExternalLinkRel } from "@/lib/seo";

interface HeaderProps {
  siteName: string;
  logoUrl?: string | null;
}

const menuVariants = {
  closed: { height: 0, opacity: 0 },
  open: { height: "auto", opacity: 1 },
};

const linkVariants = {
  closed: { opacity: 0, y: -8 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.25 },
  }),
};

export function Header({ siteName, logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80"
          aria-label={`${siteName} — Go to homepage`}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={44}
              height={46}
              className="h-10 w-auto md:h-11"
              priority
            />
          ) : null}
          <span className="font-heading text-xl text-neutral-800 md:text-2xl">
            {siteName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => trackNavClick(link.label)}
              className="text-sm font-medium text-neutral-600 underline decoration-pink-400/0 underline-offset-4 hover:text-pink-600 hover:decoration-pink-400/50"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={SITE_CONFIG.booking.url}
            target="_blank"
            rel={getExternalLinkRel(SITE_CONFIG.booking.url)}
            onClick={() => trackBookNow(undefined, "header")}
            className="rounded-full bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-600"
          >
            Contact to Book
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </nav>

        {/* Mobile menu button */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            role="region"
            aria-label="Mobile navigation"
            className="overflow-hidden border-t border-border md:hidden"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href={link.href}
                    onClick={() => {
                      closeMenu();
                      trackNavClick(`${link.label}_mobile`);
                    }}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-neutral-600 hover:bg-pink-50 hover:text-pink-600"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                custom={NAV_LINKS.length}
                variants={linkVariants}
                initial="closed"
                animate="open"
              >
                <a
                  href={SITE_CONFIG.booking.url}
                  target="_blank"
                  rel={getExternalLinkRel(SITE_CONFIG.booking.url)}
                  onClick={() => {
                    closeMenu();
                    trackBookNow(undefined, "header_mobile");
                  }}
                  className="mt-2 block rounded-full bg-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-pink-600"
                >
                  Contact to Book
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
