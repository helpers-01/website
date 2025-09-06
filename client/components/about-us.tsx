import { Card, CardContent } from "@/components/ui/card"
import { Users, Star, DollarSign, CheckCircle } from "lucide-react"

export function AboutUs() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-balance">About Us</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-pretty">
              <span className="font-semibold text-purple-600">Helpers</span> — a very common word that almost everyone has heard of. A person who helps another person with the job they are doing.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-pretty">
              It is a user-friendly app and web service to provide an environment where the locals around you who possess great skills in their particular work — whether it's housekeeping, plumbing, electrician, painting, medical store, general store, and many more — can provide you the necessary work without even searching out for these people. The app provides all the necessary information about the particular person and about their shop if they have any.
            </p>
          </div>

          {/* Why Helpers Section */}
          <Card className="border-purple-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Why Helpers?
              </h3>

              <div className="grid md:grid-cols-1 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Choose yourself</h4>
                    <p className="text-gray-700 text-pretty">Find the suitable person to assist you with the work from our verified network of professionals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Reviewed helpers</h4>
                    <p className="text-gray-700 text-pretty">Before asking for their help, check ratings and reviews in their profiles to ensure quality service.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fix your own price</h4>
                    <p className="text-gray-700 text-pretty">It is totally up to you at what price you want the helper to assist you. If both agree, let the work be done by the helper.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <div className="mt-12 text-center">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
                <p className="text-lg text-gray-700 text-pretty">
                  To connect skilled local professionals with people who need their services, creating a transparent, trustworthy, and efficient marketplace for home and local services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}