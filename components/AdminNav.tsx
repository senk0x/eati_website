'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/referrals', label: 'Referrals' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-eati-ink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="ml-auto text-sm text-gray-500 hover:text-[#88B8FF]"
      >
        View site
      </Link>
    </nav>
  );
}
