import Link from 'next/link'

export default function Home() {
  return (
    <div className="stack">
      <h2>Home</h2>
      <p>MVP build in progress — UI is plain while features are wired up.</p>
      <ul>
        <li><Link href="/shop">Browse products</Link></li>
        <li><Link href="/cart">View cart</Link></li>
        <li><Link href="/account">My account</Link></li>
        <li><Link href="/track-order">Track an order</Link></li>
        <li><Link href="/login">Sign in</Link></li>
        <li><Link href="/signup">Create account</Link></li>
      </ul>
    </div>
  )
}
