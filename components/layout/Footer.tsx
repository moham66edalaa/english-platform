import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">Elo<span>quence</span></div>
      <div className="footer-links">
        <Link href="/#courses">Courses</Link>
        <Link href="/#placement">Placement Test</Link>
        <Link href="/#pricing">Pricing</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} Eloquence English Platform. All rights reserved.</div>
    </footer>
  )
}