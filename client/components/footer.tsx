import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border text-sm text-textSecondary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary">About Us</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Helpers is your trusted service marketplace, connecting users and helpers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-textSecondary hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/safety" className="text-textSecondary hover:text-primary transition-colors">Safety</Link></li>
              <li><Link href="/support" className="text-textSecondary hover:text-primary transition-colors">Support</Link></li>
              <li><Link href="/contact" className="text-textSecondary hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-textSecondary hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-textSecondary hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary">Get in Touch</h3>
            <p className="text-textSecondary text-sm">
              Have questions? We're here to help 24/7.
            </p>
            <p className="text-textSecondary text-sm">
              Email: support@helpers.com<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-textSecondary text-sm">
            © 2025 Helpers Limited. Terms and Conditions apply.
          </p>
        </div>
      </div>
    </footer>
  )
}