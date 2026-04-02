import Link from 'next/link'
import Image from 'next/image'

const SHOP_CATEGORIES = [
  'Beverages',
  'Caribbean product',
  'Cosmetics',
  'Flours & Rice',
  'Fresh Produce',
  'Meat and Seafood',
  'Spices',
]

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'All Products', href: '/shop' },
  { label: 'Sign in / Account', href: '/login' },
  { label: 'Track Order', href: '/track-order' },
]

const STORE_MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=1668+E+Dublin+Granville+Rd+Columbus+OH+43229'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">

        {/* Brand */}
        <div className="md:col-span-4">
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="Lovely Queen African Market"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Authentic African and Caribbean products delivered to your door from our Columbus store. African staples,
            beverages, spices, fresh produce, fabrics, and more.
          </p>
          <div className="mt-5 space-y-1.5 text-sm">
            <p className="font-semibold text-gray-900">Visit us</p>
            <p>Located in Karl Plaza</p>
            <p>1668 E Dublin Granville Rd, Columbus, OH 43229</p>
            <p>(614) 446-0893</p>
            <a
              href={STORE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-semibold text-[#236641] hover:text-[#1a4731] transition-colors"
            >
              Get directions
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-4">
          <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wide">Shop by Category</h4>
          <ul className="space-y-2.5">
            {SHOP_CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  className="text-sm hover:text-[#236641] transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="md:col-span-4">
          <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wide">Quick Links</h4>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-sm hover:text-[#236641] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-5 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Lovely Queen African Market. All rights reserved.</span>
          <span>Authentic. Trusted. Delivered.</span>
        </div>
      </div>
    </footer>
  )
}
