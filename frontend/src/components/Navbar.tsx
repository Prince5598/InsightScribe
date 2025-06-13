import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Upload, FileSpreadsheet, Mic, Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { state } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/summary', icon: FileText, label: 'Summary' },
    { path: '/ppt', icon: FileSpreadsheet, label: 'PPT' },
    { path: '/podcast', icon: Mic, label: 'Podcast' },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Research Assistant</span>
          </div>

          {state.fileName && (
            <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <FileText className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white truncate max-w-48">{state.fileName}</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;