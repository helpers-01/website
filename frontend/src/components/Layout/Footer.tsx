import React from 'react';
import { Mail, Phone, Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold">Helpers</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connect with trusted service providers for all your home and business needs. 
              From cleaning to repairs, find the perfect helper for any task.
            </p>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:support@helpers.com" 
                className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>support@helpers.com</span>
              </a>
              <a 
                href="tel:+15551234567" 
                className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">House Cleaning</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Plumbing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Electrical</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Handyman</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Gardening</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Safety</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Helpers. All rights reserved. | Building trust through quality service connections.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;