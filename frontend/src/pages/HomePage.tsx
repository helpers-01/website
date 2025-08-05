import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const services = [
    {
      name: 'House Cleaning',
      description: 'Professional cleaning services for your home',
      image: 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      helpers: '12 helpers available'
    },
    {
      name: 'Plumbing',
      description: 'Expert plumbing repairs and installations',
      image: 'https://images.pexels.com/photos/8486991/pexels-photo-8486991.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      helpers: '8 helpers available'
    },
    {
      name: 'Electrical',
      description: 'Licensed electricians for all your needs',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      helpers: '6 helpers available'
    },
    {
      name: 'Handyman',
      description: 'General repairs and maintenance services',
      image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      helpers: '15 helpers available'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Helpers',
      description: 'All helpers undergo background checks and skill verification'
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: 'Browse helpers with excellent ratings and reviews from real customers'
    },
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Book services in minutes with instant confirmation'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Perfect
              <span className="block text-purple-200">Helper for Any Task</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Connect with trusted, verified service providers in your area. 
              From cleaning to repairs, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link
                to="/services"
                className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Find a Helper
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register-helper"
                className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-center"
              >
                Become a Helper
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Helpers?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find reliable, skilled professionals for any job
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our most requested services and find the perfect helper
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to="/services"
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <p className="text-sm text-purple-600 font-medium">{service.helpers}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Helpers for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/services"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book a Service
            </Link>
            <Link
              to="/register-helper"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Start Earning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;