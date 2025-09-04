import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Helpers%20logo.jpg-8tii2yjyr4KGeMlFK33cmezJCBajnt.jpeg"
            alt="Helpers Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-foreground">Helpers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
            Services
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
