import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../api/supabaseClient';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { redirectTo: location.pathname } });
  };

  const handleSignUpRedirect = () => {
    navigate('/signup', { state: { redirectTo: location.pathname } });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">Helpers</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-purple-600">Services</Link>
            <Link to="/support" className="text-gray-700 hover:text-purple-600">How it works</Link>
            <Link to="/support" className="text-gray-700 hover:text-purple-600">Reviews</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/register-helper" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Post a task</Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
                <Link to="/edit-profile" className="text-gray-700 hover:text-purple-600">Edit Profile</Link>
                <img
                  src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                  alt="avatar"
                  onClick={() => navigate('/edit-profile')}
                  className="h-8 w-8 rounded-full object-cover cursor-pointer"
                />
                <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-purple-600">
                  <LogOut className="h-5 w-5 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={handleLoginRedirect} className="text-gray-700 hover:text-purple-600">Login</button>
                <button onClick={handleSignUpRedirect} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">Sign Up</button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden p-2 rounded-md text-gray-700 hover:text-purple-600">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-purple-600">Services</Link>
              <Link to="/support" className="text-gray-700 hover:text-purple-600">How it works</Link>
              <Link to="/support" className="text-gray-700 hover:text-purple-600">Reviews</Link>
              <Link to="/register-helper" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center">Post a task</Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
                  <Link to="/edit-profile" className="text-gray-700 hover:text-purple-600">Edit Profile</Link>
                  <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-purple-600 mt-2">
                    <LogOut className="h-5 w-5 mr-1" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <button onClick={handleLoginRedirect} className="text-gray-700 hover:text-purple-600 text-left">Login</button>
                  <button onClick={handleSignUpRedirect} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;