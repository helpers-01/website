import { Button } from "@/components/ui/button"
import { Smartphone, Download } from "lucide-react"

export function AppDownload() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Smartphone className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-balance">Get the Helpers App</h2>
          <p className="text-xl mb-8 opacity-90 text-pretty">
            Download our mobile app for easier booking and exclusive offers
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              <Download className="w-5 h-5 mr-2" />
              Download for Android
            </Button>
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              <Download className="w-5 h-5 mr-2" />
              Download for iOS
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
