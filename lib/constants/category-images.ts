const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=420&h=420&fit=crop&q=80`

export const CATEGORY_IMAGES: Record<string, string> = {
  // Real food photography — no composites or AI imagery
  Beverages:       U('X21UfqJwpuk'), // grocery shelf stocked with bottled drinks
  Bread:           U('uGopmYwL7TI'), // two artisan loaves on a cutting board
  Canned:          U('78sgLm2QGP4'), // vintage canned goods on store shelves
  'Caribbean product': U('gw0_4PckI8Q'), // pile of ripe mangoes
  Cosmetics:       U('4rO9pYB_hgw'), // natural skincare products on wood
  'Dairy And Tea': U('Zzc9i7GUz50'), // eggs and glass of milk on linen
  'Flours & Rice': U('E85Jb-wW7Tg'), // wooden scoop resting on a pile of rice
  'Fresh Produce': U('k0MigzUz-vI'), // pile of sweet potatoes / yams
  'Frozen foods':  U('r4AaDhoKcO8'), // shrimp on ice
  'Meat and Seafood': U('DCC6qE0RAps'), // fresh seafood displayed at a market
  Motherland:      U('e6PwBakXOJM'), // jars of pantry staples on a shelf
  'Non food':      U('48gk2I7mRs8'), // cleaning-products display in a store
  Snack:           U('7urn4fbk6yo'), // chips and dips on a tray
  Spices:          U('O6nOEZcLCWQ'), // bowls of colourful spices
}

export function getCategoryImage(category: string): string | undefined {
  return CATEGORY_IMAGES[category]
}
