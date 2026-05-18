'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { NavbarAuth } from '@/components/NavbarAuth'

export function Navbar() {
  const { totalItems } = useCart()

  return (
    <header>
      <h1 style={{ margin: 0 }}>
        <Link href="/">Lovely Queen Market</Link>
      </h1>
      <nav className="row">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/cart">Cart ({totalItems})</Link>
        <Link href="/track-order">Track order</Link>
        <Link href="/account">Account</Link>
        <NavbarAuth />
      </nav>
      <hr />
    </header>
  )
}
