/** Curated discovery rows — link to shop filters (no separate CMS yet). */
export const FEATURED_COLLECTIONS = [
  {
    id: 'ghana',
    title: 'Ghanaian Essentials',
    subtitle: 'Shito, banku mix, plantain chips & more',
    emoji: '🇬🇭',
    href: '/shop?category=Spices',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  },
  {
    id: 'nigeria',
    title: 'Nigerian Favorites',
    subtitle: 'Jollof rice, suya spice, palm oil',
    emoji: '🇳🇬',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1586201378083-7d759022257d?w=800&q=80',
  },
  {
    id: 'spices',
    title: 'Popular Spices',
    subtitle: 'Heat, aroma & authentic blends',
    emoji: '🌶️',
    href: '/shop?category=Spices',
    image: 'https://images.unsplash.com/photo-1596040035739-62d3p17a625?w=800&q=80',
  },
  {
    id: 'frozen',
    title: 'Frozen Favorites',
    subtitle: 'Fish, leaves & frozen raw goods',
    emoji: '🧊',
    href: '/shop?category=Frozen%20foods',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
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
    title: 'Jollof pantry staples',
    time: 'Rice, paste & spices',
    difficulty: 'Ingredients only',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1586201378083-7d759022257d?w=800&q=80',
  },
  {
    title: 'Soup & stew basics',
    time: 'Palm oil, spices, stockfish',
    difficulty: 'Ingredients only',
    href: '/shop?category=Spices',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  },
  {
    title: 'Grains & flours',
    time: 'Rice, beans, cassava & plantain flour',
    difficulty: 'Ingredients only',
    href: '/shop?category=Flours%20%26%20Rice',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
  },
] as const
