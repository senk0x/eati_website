import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-2 sm:px-5 md:px-6 md:pb-6">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-[2rem] p-6 sm:p-8 md:rounded-[3rem] md:p-12"
          style={{ backgroundColor: "#85BEFF" }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo */}
            <div className="h-8 w-[72px] shrink-0 md:h-9 md:w-[84px]">
              <Image
                src="/images/logo-footer.svg"
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

          {/* Copyright */}
          <div
            className="mt-8 text-center text-sm text-white"
          >
            <p>&copy; 2026 Eati. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
