'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="stack" suppressHydrationWarning>
        <h2>Cart</h2>
        <p>Your cart is empty.</p>
        <p><Link href="/shop">← Browse products</Link></p>
      </div>
    )
  }

  return (
    <div className="stack" suppressHydrationWarning>
      <h2>Cart ({totalItems} item{totalItems === 1 ? '' : 's'})</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>
                <Link href={`/products/${product.id}`}>{product.name}</Link>
                <br />
                <span className="muted">{product.category}</span>
              </td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value || '1', 10)))}
                  style={{ width: '4em' }}
                />
              </td>
              <td>${(product.price * quantity).toFixed(2)}</td>
              <td>
                <button type="button" onClick={() => removeItem(product.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}><strong>Total</strong></td>
            <td colSpan={2}><strong>${totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div className="row">
        <Link href="/checkout"><strong>Proceed to checkout →</strong></Link>
        <Link href="/shop">Continue shopping</Link>
        <button type="button" onClick={clearCart}>Clear cart</button>
      </div>
    </div>
  )
}
