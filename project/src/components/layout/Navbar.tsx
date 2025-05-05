import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinks = [
    { path: '/', label: 'Home', auth: false },
    { path: '/profile', label: 'Profile', auth: true },
    { path: '/documents', label: 'Documents', auth: true },
    { path: '/social-media', label: 'Social Media', auth: true },
    { path: '/dashboard', label: 'Dashboard', auth: true },
  ];

  return (
    <nav className="bg-furia-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-furia-accent font-display font-bold text-xl">FURIA</span>
              <span className="ml-2 text-white font-display font-semibold">KnowYourFan</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                (!link.auth || isAuthenticated) && (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={`${
                      location.pathname === link.path 
                        ? 'bg-furia-gray text-furia-accent' 
                        : 'text-white hover:bg-furia-gray hover:text-furia-accent'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
            
            {isAuthenticated ? (
              <div className="ml-4 flex items-center">
                <div className="relative">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-furia-accent hover:bg-furia-accent/80 focus:outline-none transition-colors duration-200"
                    >
                      <LogOut size={16} className="mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="ml-4 flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-furia-accent hover:bg-furia-accent/80 focus:outline-none transition-colors duration-200"
                >
                  <User size={16} className="mr-1" />
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-furia-gray focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            (!link.auth || isAuthenticated) && (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`${
                  location.pathname === link.path 
                    ? 'bg-furia-gray text-furia-accent' 
                    : 'text-white hover:bg-furia-gray hover:text-furia-accent'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
        
        {isAuthenticated ? (
          <div className="pt-4 pb-3 border-t border-furia-gray">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user?.name}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-furia-gray focus:outline-none"
              >
                <LogOut size={20} />
                <span className="ml-1">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-furia-gray">
            <div className="flex items-center justify-center px-5">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-furia-accent hover:bg-furia-accent/80"
              >
                <User size={18} className="mr-1" />
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;