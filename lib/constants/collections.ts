/** Curated discovery rows — link to shop filters (aligned with live catalog). */
export const FEATURED_COLLECTIONS = [
  {
    id: 'staples',
    title: 'Yam, Fufu & Pantry',
    subtitle: 'Flours, gari, banku, rice & African staples',
    emoji: '🍠',
    href: '/shop?category=Flours%20%26%20Rice',
    image: '/images/categories/flours-rice.jpg',
  },
  {
    id: 'produce',
    title: 'Fresh Market',
    subtitle: 'Yam, plantain, greens & produce',
    emoji: '🥬',
    href: '/shop?category=Fresh%20Produce',
    image: '/images/categories/fresh-produce.jpg',
  },
  {
    id: 'beverages',
    title: 'Drinks & Beverages',
    subtitle: 'Malt, beer, juices & African favorites',
    emoji: '🥤',
    href: '/shop?category=Beverages',
    image: '/images/categories/beverages.jpg',
  },
  {
    id: 'beauty',
    title: 'Beauty & Body Care',
    subtitle: 'Lotions, soaps & skincare',
    emoji: '✨',
    href: '/shop?category=Cosmetics',
    image: '/images/categories/cosmetics.jpg',
  },
] as const
