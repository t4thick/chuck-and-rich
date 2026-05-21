/**
 * Category hero images from asafointernational.com (same taxonomy as Lovely Queen).
 * Used for WooCommerce-style category tiles on home and shop.
 */
export const CATEGORY_IMAGES: Record<string, string> = {
  Beverages:
    'https://asafointernational.com/wp-content/uploads/2025/01/Beverages-2-min-420x420.jpg',
  Bread:
    'https://asafointernational.com/wp-content/uploads/2025/01/Bread-Display-1-420x420.png',
  Canned:
    'https://asafointernational.com/wp-content/uploads/2025/01/Motherland-canned-images-420x420.jpeg',
  'Caribbean product':
    'https://asafointernational.com/wp-content/uploads/2025/01/Carribean-Display-min-420x420.png',
  Cosmetics:
    'https://asafointernational.com/wp-content/uploads/2025/01/cosmetics-420x420.jpeg',
  'Dairy And Tea':
    'https://asafointernational.com/wp-content/uploads/2025/01/asafo-international-Diary-420x420.jpeg',
  'Flours & Rice':
    'https://asafointernational.com/wp-content/uploads/2025/01/Rice-and-Flour-Display-420x420.png',
  'Fresh Produce':
    'https://asafointernational.com/wp-content/uploads/2025/01/yam-display-420x420.jpg',
  'Frozen foods':
    'https://asafointernational.com/wp-content/uploads/2025/01/Frozen-Foods-min-420x420.jpg',
  'Meat and Seafood':
    'https://asafointernational.com/wp-content/uploads/2025/01/meat-420x420.jpeg',
  Motherland:
    'https://asafointernational.com/wp-content/uploads/2025/01/Motherland-Product-display-420x420.jpg',
  'Non food':
    'https://asafointernational.com/wp-content/uploads/2025/02/Non-Food-420x420.jpg',
  Snack:
    'https://asafointernational.com/wp-content/uploads/2024/10/Asafo-International-Snacks-420x420.jpg',
  Spices:
    'https://asafointernational.com/wp-content/uploads/2024/11/42-tm_home_default.png',
}

export function getCategoryImage(category: string): string | undefined {
  return CATEGORY_IMAGES[category]
}
