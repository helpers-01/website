import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Search, MapPin, Star } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [helpers, setHelpers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const categoryId = searchParams.get('category');

  useEffect(() => {
    fetchHelpers();
  }, [searchTerm, categoryId]);

  const fetchHelpers = async () => {
    let query = supabase
      .from('helpers')
      .select('*')
      .ilike('name', `%${searchTerm}%`);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching helpers:', error);
    } else {
      setHelpers(data || []);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Search Results
          </h1>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or skill..."
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpers.map((helper) => (
            <Link
              key={helper.id}
              to={`/helper/${helper.id}`}
              className="bg-white shadow hover:shadow-md rounded-xl transition overflow-hidden"
            >
              <div className="p-6 pb-4 flex items-center space-x-4">
                <img
                  src={helper.avatar_url || '/default-avatar.png'}
                  alt={helper.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{helper.name}</h3>
                  <p className="text-gray-600">{helper.profession}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {helper.rating || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-4 text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {helper.location || 'Location Not Available'}
                </div>
                <p>Experience: {helper.experience || 'N/A'}</p>
                <p>Price: {helper.price || 'Contact'}</p>
              </div>
            </Link>
          ))}
        </div>

        {helpers.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Helpers Found</h3>
            <p className="text-gray-600">
              Try modifying your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;