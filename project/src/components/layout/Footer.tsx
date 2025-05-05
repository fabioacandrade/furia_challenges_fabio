import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Twitch } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-furia-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-furia-accent font-display font-bold text-xl">FURIA</span>
              <span className="ml-2 text-white font-display font-semibold">KnowYourFan</span>
            </div>
            <p className="text-gray-300 text-sm">
              Get to know your fans better and create personalized experiences for your esports community.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-furia-accent transition-colors duration-200">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-furia-accent transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect with FURIA</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/furiagg" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-furia-accent transition-colors duration-200">
                <Github size={24} />
              </a>
              <a href="https://twitter.com/furia" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-furia-accent transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com/furia" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-furia-accent transition-colors duration-200">
                <Instagram size={24} />
              </a>
              <a href="https://twitch.tv/furia" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-furia-accent transition-colors duration-200">
                <Twitch size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-furia-gray pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} FURIA Esports. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;