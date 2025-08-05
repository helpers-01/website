import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon_url: string;
}

const LandingPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Trusted Helpers Near You
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Book skilled professionals for home services, repairs, and more.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/search?category=${category.id}`}
              className="bg-white shadow hover:shadow-lg transition p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer"
            >
              <img
                src={category.icon_url}
                alt={category.name}
                className="h-16 w-16 mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-2 text-center">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;