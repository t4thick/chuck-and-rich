// Real food photography from Unsplash free tier (images.unsplash.com, not plus.unsplash.com).
// CDN IDs verified — these are NOT the short page slugs, they are the actual image IDs.
const U = (cdnId: string) =>
  `https://images.unsplash.com/${cdnId}?w=420&h=420&fit=crop&q=80`

export const CATEGORY_IMAGES: Record<string, string> = {
  Beverages:           U('photo-1755752919046-a6543db419cc'), // grocery shelf with bottled drinks
  Bread:               U('photo-1725297952102-ab28892a31ab'), // assorted breads on a table
  Canned:              U('photo-1760926548218-086f0f60e778'), // vintage canned goods on shelves
  'Caribbean product': U('photo-1617631716600-6a454b430367'), // green bananas / plantains
  Cosmetics:           U('photo-1580870069867-74c57ee1bb07'), // skincare bottles on surface
  'Dairy And Tea':     U('photo-1552593050-477020c5af3f'), // eggs and glass of milk
  'Flours & Rice':     U('photo-1686820740687-426a7b9b2043'), // pile of white rice
  'Fresh Produce':     U('photo-1730815048561-45df6f7f331d'), // sweet potatoes / yams
  'Frozen foods':      U('photo-1601599967100-f16100982063'), // commercial refrigerator
  'Meat and Seafood':  U('photo-1754587489041-9fc8301f4c98'), // fresh seafood at market
  Motherland:          U('photo-1645567454567-901dc409551b'), // jars of pantry staples
  'Non food':          U('photo-1643107303813-077f2061cec1'), // cleaning products in store
  Snack:               U('photo-1644447393594-86ac32d94a09'), // chips and dips on tray
  Spices:              U('photo-1524593481568-2e46b9ffcd16'), // colourful spice bowls
}

export function getCategoryImage(category: string): string | undefined {
  return CATEGORY_IMAGES[category]
}
