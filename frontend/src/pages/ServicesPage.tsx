import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import { supabase } from '../api/supabaseClient';

interface Category {
  id: string;
  name: string;
}

interface Helper {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  experience: string;
  price: string;
  skills: string[];
  image: string;
  location: string;
  available: boolean;
  category: string;
}

const ServicesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [helpers, setHelpers] = useState<Helper[]>([]);

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to fetch categories:', error);
    } else {
      setCategories([{ id: 'all', name: 'All Services' }, ...(data || [])]);
    }
  };

  // Static Helpers (Later you can fetch from Supabase or API)
  useEffect(() => {
    // This data should ideally come from backend later
    setHelpers([
      // (same hardcoded helpers as you already have)
      // Keep this as is for now
    ]);
  }, []);

  const filteredHelpers = helpers.filter(helper => {
    const matchesSearch =
      helper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helper.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helper.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || helper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Helper
          </h1>
          <p className="text-lg text-gray-600">Browse verified service providers in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search helpers, services, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredHelpers.length} helper{filteredHelpers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Helpers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHelpers.map(helper => (
            <div key={helper.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-start space-x-4">
                  <img src={helper.image} alt={helper.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{helper.name}</h3>
                    <p className="text-gray-600">{helper.profession}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {helper.rating} ({helper.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    helper.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {helper.available ? 'Available' : 'Busy'}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" /> {helper.location}
                </div>
                <div className="text-sm text-gray-600 mb-3">Experience: {helper.experience}</div>
                
                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {helper.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {helper.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        +{helper.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">{helper.price}</span>
                  <Link
                    to={`/helper/${helper.id}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      helper.available ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {helper.available ? 'View Profile' : 'Unavailable'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredHelpers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No helpers found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters to find more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;