import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-2 sm:px-5 md:px-6 md:pb-6">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-[2rem] p-6 sm:p-8 md:rounded-[3rem] md:p-12"
          style={{ backgroundColor: "#88B8FF" }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo */}
            <div className="h-8 w-[72px] shrink-0 md:h-9 md:w-[84px]">
              <Image
                src="/images/blog/Frame 101455.svg"
                alt="Eati — AI calorie tracker and nutrition app logo"
                width={84}
                height={36}
                className="h-full w-auto object-contain object-left"
              />
            </div>

            {/* Links - min 44px touch target on mobile */}
            <nav
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white md:gap-8"
             
              aria-label="Footer navigation"
            >
              <Link href="/tools" className="min-h-[44px] min-w-[44px] py-2 hover:underline md:min-h-0 md:min-w-0 md:py-0">
                Tools
              </Link>
              <Link href="/blog" className="min-h-[44px] min-w-[44px] py-2 hover:underline md:min-h-0 md:min-w-0 md:py-0">
                Blog
              </Link>
              <Link href="/contact" className="min-h-[44px] min-w-[44px] py-2 hover:underline md:min-h-0 md:min-w-0 md:py-0">
                Contact
              </Link>
              <Link href="/privacy-policy" className="min-h-[44px] min-w-[44px] py-2 hover:underline md:min-h-0 md:min-w-0 md:py-0">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="min-h-[44px] min-w-[44px] py-2 hover:underline md:min-h-0 md:min-w-0 md:py-0">
                Terms of Use
              </Link>
            </nav>
          </div>

          {/* Social links */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://www.youtube.com/@eati_app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eati on YouTube"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white opacity-80 transition-opacity hover:opacity-100"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div
            className="mt-4 text-center text-sm text-white"
          >
            <p>&copy; 2026 Eati. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
