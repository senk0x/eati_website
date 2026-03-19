"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const LOGO_INTERVAL_MS = 4000;

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [showMascot, setShowMascot] = useState(true);
  const [useAnimatedSwap, setUseAnimatedSwap] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setShowMascot((prev) => {
        setUseAnimatedSwap(true);
        return !prev;
      });
    }, LOGO_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5">
      <nav className="mx-auto max-w-7xl rounded-2xl bg-white px-4 py-3 sm:rounded-2xl sm:px-6 sm:py-4 md:rounded-3xl md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - animated swap between mascot and text */}
          <Link
            href="/"
            aria-label="Go to landing page"
            className="logo-swap-container shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#85BEFF] focus-visible:ring-offset-2"
          >
            <span
              className={`logo-swap-item ${showMascot ? (useAnimatedSwap ? "logo-enter" : "logo-visible") : "logo-exit"}`}
              aria-hidden={!showMascot}
            >
              <Image
                src="/images/logo-mascot.png"
                alt="Eati"
                width={84}
                height={40}
                className="h-9 w-auto object-contain object-left md:h-10"
                priority
              />
            </span>
            <span
              className={`logo-swap-item ${!showMascot ? (useAnimatedSwap ? "logo-enter" : "logo-visible") : "logo-exit"}`}
              aria-hidden={showMascot}
            >
              <Image
                src="/images/logo-text.svg"
                alt="Eati"
                width={84}
                height={40}
                className="h-9 w-auto object-contain object-left md:h-10"
              />
            </span>
          </Link>

          {/* Desktop navigation */}
          <div
            className="hidden items-center gap-6 md:flex lg:gap-8"
            style={{ fontFamily: "var(--font-rubik), sans-serif" }}
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-base font-medium transition-colors hover:text-[#85BEFF] md:text-lg"
                style={{ color: "#364052" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* App Store button - min 44px touch target on mobile */}
          <a
            href="https://apps.apple.com/app/apple-store/id6758241088?pt=127995771&ct=Official%20Website&mt=8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[#364052] bg-[#364052] px-4 py-2.5 text-white transition-all hover:bg-white hover:text-[#364052] md:h-11 md:min-h-0 md:min-w-0 md:px-5"
            style={{ fontFamily: "var(--font-rubik), sans-serif" }}
          >
            <svg className="h-5 w-5 shrink-0 md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-sm font-semibold">App Store</span>
          </a>

          {/* Mobile menu button - 44px touch target */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#364052] transition-colors hover:bg-[#F0F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#85BEFF] md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div
            className="mt-4 flex flex-col gap-1 border-t border-[#E3ECF7] pt-4 md:hidden"
            style={{ fontFamily: "var(--font-rubik), sans-serif" }}
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-4 text-base font-medium text-[#364052] transition-colors hover:bg-[#F0F4F8] hover:text-[#85BEFF]"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
