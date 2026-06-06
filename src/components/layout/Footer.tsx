import React from 'react';
import { Heart, Globe, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();

  // Only show the footer on the home screen
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-[#0a0a1a] pt-16 pb-8 px-6 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="TrapCrush Logo" className="w-6 h-6 rounded-md" />
              <span className="text-xl font-bold text-white tracking-tight">TrapCrush</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Create beautiful, interactive romantic pages for your crush. The internet's most devious love tool.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-pink-400 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="mailto:chenkhamchowlu@gmail.com" className="hover:text-pink-400 transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/templates" className="hover:text-pink-400 transition-colors">Templates</Link></li>
              <li><Link to="/create" className="hover:text-pink-400 transition-colors">Create Page</Link></li>
              <li><Link to="/dashboard" className="hover:text-pink-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-pink-400 transition-colors">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-pink-400 transition-colors">Cookie Policy</Link></li>
              <li><a href="mailto:chenkhamchowlu@gmail.com" className="hover:text-pink-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500">
            © {new Date().getFullYear()} TrapCrush. All rights reserved.
          </div>
          <div className="text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> for romantics everywhere
          </div>
        </div>
      </div>
    </footer>
  );
};
