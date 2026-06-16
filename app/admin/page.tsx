import Link from 'next/link';

export default function AdminIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-eati-ink">Eati Admin</h1>
        <p className="mb-8 text-sm text-gray-500">Choose a section to manage.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/analytics"
            className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#88B8FF]"
          >
            <h2 className="text-lg font-semibold text-eati-ink">Analytics</h2>
            <p className="mt-2 text-sm text-gray-500">
              Site traffic, App Store clicks, time on site, and hero A/B results.
            </p>
          </Link>
          <Link
            href="/admin/blog"
            className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#88B8FF]"
          >
            <h2 className="text-lg font-semibold text-eati-ink">Blog</h2>
            <p className="mt-2 text-sm text-gray-500">
              Create and publish blog articles.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
