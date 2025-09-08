import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 border-b border-purple-300 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Helpers logo.jpg"
            alt="Helpers Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-white">Helpers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/services" className="text-white/90 hover:text-white transition-colors font-medium">
            Services
          </Link>
          <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors font-medium">
            How It Works
          </a>
          <a href="#about" className="text-white/90 hover:text-white transition-colors font-medium">
            About
          </a>
          <a href="#contact" className="text-white/90 hover:text-white transition-colors font-medium">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex text-white border-white/20 hover:bg-white/10 hover:text-white">
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-md">
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
