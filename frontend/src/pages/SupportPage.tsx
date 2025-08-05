import React, { useState } from 'react';
import { Search, Phone, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I book a service?',
      answer: 'To book a service, browse our helpers, select one that matches your needs, choose an available time slot, and confirm your booking. You\'ll receive a confirmation email with all the details.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and bank transfers. Payment is processed securely after the service is completed to your satisfaction.'
    },
    {
      id: 3,
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule up to 24 hours before your booking without any charges. Cancellations within 24 hours may incur a small fee.'
    },
    {
      id: 4,
      question: 'How are helpers verified?',
      answer: 'All helpers undergo identity verification and can opt for background checks. We also verify their skills and collect reviews from previous customers to ensure quality service.'
    },
    {
      id: 5,
      question: 'What if I\'m not satisfied with the service?',
      answer: 'Customer satisfaction is our priority. If you\'re not happy with the service, contact our support team within 24 hours and we\'ll work to resolve the issue, including potential refunds.'
    },
    {
      id: 6,
      question: 'How do I become a helper?',
      answer: 'Click "Post a task" or "Become a Helper" to register. Fill out your profile, verify your identity, set your rates, and start receiving booking requests from customers in your area.'
    },
    {
      id: 7,
      question: 'Are helpers insured?',
      answer: 'Helpers are encouraged to carry their own insurance. We also provide basic coverage for certain services. Check with individual helpers about their insurance coverage.'
    },
    {
      id: 8,
      question: 'How does pricing work?',
      answer: 'Each helper sets their own hourly rates. You\'ll see the rate upfront before booking. The final cost depends on the time spent and any additional services requested.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Monday to Friday, 9 AM - 6 PM</p>
            <a
              href="tel:+15551234567"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              +1 (555) 123-4567
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">We'll respond within 24 hours</p>
            <a
              href="mailto:support@helpers.com"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              support@helpers.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-3">Available 24/7 for urgent issues</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="mt-4 pr-8">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try different keywords or contact our support team for help.
              </p>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
            <p className="text-gray-600 mb-4">
              Learn about our platform, how to book services, and what to expect from your helper.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Read Guide →
            </button>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Guidelines</h3>
            <p className="text-gray-600 mb-4">
              Important safety information for both customers and helpers to ensure secure transactions.
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium">
              View Guidelines →
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a topic</option>
                <option value="booking">Booking Issues</option>
                <option value="payment">Payment Problems</option>
                <option value="account">Account Questions</option>
                <option value="helper">Helper Registration</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;