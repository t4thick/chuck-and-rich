/** Curated discovery rows — link to shop filters (aligned with live catalog). */
export const FEATURED_COLLECTIONS = [
  {
    id: 'pantry',
    title: 'Pantry Staples',
    subtitle: 'Rice, fufu, banku, gari & grains — 40+ items',
    emoji: '🌾',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1586201378083-7d759022257d?w=800&q=80',
  },
  {
    id: 'beauty',
    title: 'Beauty & Body Care',
    subtitle: 'Caro White, Qei+, lotions & African skincare',
    emoji: '✨',
    href: '/shop?category=Cosmetics',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  },
  {
    id: 'beverages',
    title: 'Drinks & Beverages',
    subtitle: 'Malt, beer, juices & African favorites',
    emoji: '🥤',
    href: '/shop?category=Beverages',
    image: 'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=800&q=80',
  },
  {
    id: 'produce',
    title: 'Fresh Market',
    subtitle: 'Produce, onions, potatoes & more',
    emoji: '🥬',
    href: '/shop?category=Fresh%20Produce',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  },
] as const

export const COOK_TONIGHT_BUNDLES = [
  {
    title: 'Jollof Night',
    description: 'Rice, tomato paste, spices & pepper — everything for the pot.',
    href: '/shop?category=Flours%20%26%20Rice',
    tag: 'Best for Jollof',
    image: 'https://images.unsplash.com/photo-1586201378083-7d759022257d?w=800&q=80',
  },
  {
    title: 'Egusi Soup Kit',
    description: 'Palm oil, spices, stockfish & seasonings from our pantry.',
    href: '/shop?category=Spices',
    tag: 'Cook tonight',
    image: 'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=800&q=80',
  },
  {
    title: 'Weekend Snacks',
    description: 'Chips, biscuits, drinks & treats for the family table.',
    href: '/shop?category=Snack',
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  },
] as const

export const SHOP_BY_COUNTRY = [
  {
    country: 'Ghana',
    flag: '🇬🇭',
    label: 'Spices & grains',
    href: '/shop?category=Spices',
  },
  {
    country: 'Nigeria',
    flag: '🇳🇬',
    label: 'Rice & pantry',
    href: '/shop?category=Flours%20%26%20Rice',
  },
  {
    country: 'Caribbean',
    flag: '🇯🇲',
    label: 'Island favorites',
    href: '/shop?category=Caribbean%20product',
  },
  {
    country: 'West Africa',
    flag: '🌍',
    label: 'Motherland picks',
    href: '/shop?category=Motherland',
  },
] as const

export const TESTIMONIALS = [
  {
    quote: 'Finally a store that feels like home. Fresh spices and the staff knows exactly what I need for jollof.',
    name: 'Amara O.',
    location: 'Columbus, OH',
    rating: 5,
  },
  {
    quote: 'Clean website, fast pickup, and they always have the products I can’t find anywhere else.',
    name: 'Kwame A.',
    location: 'Dublin, OH',
    rating: 5,
  },
  {
    quote: 'Lovely Queen is our go-to for Caribbean and West African groceries. Premium quality.',
    name: 'Michelle R.',
    location: 'Westerville, OH',
    rating: 5,
  },
] as const

export const RECIPE_INSPO = [
  {
    title: 'Jollof pantry staples',
    time: 'Rice, paste & spices',
    difficulty: 'Ingredients only',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1586201378083-7d759022257d?w=800&q=80',
  },
  {
    title: 'Drinks & malt',
    time: 'Beer, malt & juice',
    difficulty: 'In stock now',
    href: '/shop?category=Beverages',
    image: 'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=800&q=80',
  },
  {
    title: 'Fresh market picks',
    time: 'Produce & vegetables',
    difficulty: 'In stock now',
    href: '/shop?category=Fresh%20Produce',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  },
] as const
