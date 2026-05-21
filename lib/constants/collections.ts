/** Curated discovery rows — link to shop filters (no separate CMS yet). */
export const FEATURED_COLLECTIONS = [
  {
    id: 'ghana',
    title: 'Ghanaian Essentials',
    subtitle: 'Shito, banku mix, plantain chips & more',
    emoji: '🇬🇭',
    href: '/shop?category=Spices',
    gradient: 'from-amber-900/90 to-earth-900/80',
  },
  {
    id: 'nigeria',
    title: 'Nigerian Favorites',
    subtitle: 'Jollof rice, suya spice, palm oil',
    emoji: '🇳🇬',
    href: '/shop?category=Flours%20%26%20Rice',
    gradient: 'from-brand-900/90 to-earth-800/85',
  },
  {
    id: 'spices',
    title: 'Popular Spices',
    subtitle: 'Heat, aroma & authentic blends',
    emoji: '🌶️',
    href: '/shop?category=Spices',
    gradient: 'from-accent-800/90 to-earth-900/80',
  },
  {
    id: 'frozen',
    title: 'Frozen Favorites',
    subtitle: 'Fish, leaves & ready-to-cook',
    emoji: '🧊',
    href: '/shop?category=Frozen%20foods',
    gradient: 'from-brand-800/90 to-brand-950/90',
  },
] as const

export const COOK_TONIGHT_BUNDLES = [
  {
    title: 'Jollof Night',
    description: 'Rice, tomato paste, spices & pepper — everything for one-pot jollof.',
    href: '/shop?category=Flours%20%26%20Rice',
    tag: 'Best seller',
  },
  {
    title: 'Egusi Soup Kit',
    description: 'Ground egusi, palm oil, stockfish & seasonings for a rich pot.',
    href: '/shop?category=Spices',
    tag: 'Family size',
  },
  {
    title: 'Fufu & Soup',
    description: 'Plantain flour, cassava, and soup bases for weekend gatherings.',
    href: '/shop?category=Flours%20%26%20Rice',
    tag: 'Weekend',
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
    quote: 'Clean website, fast pickup, and they always have the frozen fish I can’t find anywhere else.',
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
    title: 'Perfect Jollof Rice',
    time: '45 min',
    difficulty: 'Medium',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1604329768941-5c4d0a7d4f9a?w=800&q=80',
  },
  {
    title: 'Groundnut Soup',
    time: '1 hr',
    difficulty: 'Medium',
    href: '/shop?category=Spices',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
  },
  {
    title: 'Waakye at Home',
    time: '50 min',
    difficulty: 'Easy',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008296fbe?w=800&q=80',
  },
] as const
