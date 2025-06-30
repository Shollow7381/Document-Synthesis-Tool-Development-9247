import React from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import UserProfile from './UserProfile';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiZap, FiFileText, FiLayers } = FiIcons;

const Navigation = ({ currentView, setCurrentView }) => {
  const { documents, synthesizedDocuments } = useDocuments();

  const navItems = [
    { id: 'library', label: 'Shared Library', icon: FiBook, count: documents.length },
    { id: 'synthesizer', label: 'Synthesizer', icon: FiZap },
    { id: 'outputs', label: 'Generated Docs', icon: FiFileText, count: synthesizedDocuments.length },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <SafeIcon icon={FiLayers} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shared Document Library</h1>
              <p className="text-sm text-gray-500">Team Collaboration Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      currentView === item.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;