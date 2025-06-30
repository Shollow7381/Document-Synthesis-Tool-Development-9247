import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLogOut, FiSettings, FiUsers } = FiIcons;

const UserProfile = () => {
  const { user, signOut, documents, synthesizedDocuments } = useDocuments();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  const userDocuments = documents.filter(doc => doc.uploaded_by === user?.email);
  const userSynthesized = synthesizedDocuments.filter(doc => doc.created_by === user?.email);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-200 hover:border-blue-300 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
          <SafeIcon icon={FiUser} className="text-white text-sm" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {user?.email?.split('@')[0]}
          </div>
          <div className="text-xs text-gray-500">Team Member</div>
        </div>
      </motion.button>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{user?.email}</div>
                <div className="text-sm text-gray-500">Team Member</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userDocuments.length}</div>
                <div className="text-xs text-gray-500">Your Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{userSynthesized.length}</div>
                <div className="text-xs text-gray-500">Your Synthesized</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
              <SafeIcon icon={FiUsers} className="text-gray-400" />
              <span className="text-sm">Team Library</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
              <SafeIcon icon={FiSettings} className="text-gray-400" />
              <span className="text-sm">Settings</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <SafeIcon icon={FiLogOut} className="text-red-400" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;