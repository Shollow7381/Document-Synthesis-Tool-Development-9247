import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';
import SearchBar from './SearchBar';
import { useDocuments } from '../context/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiSearch, FiFolder, FiUsers, FiRefreshCw } = FiIcons;

const DocumentLibrary = () => {
  const { documents, loadDocuments, user } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const userDocuments = documents.filter(doc => doc.uploaded_by === user?.email);
  const otherDocuments = documents.filter(doc => doc.uploaded_by !== user?.email);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Shared Document Library</h2>
          <p className="text-gray-600 mt-1">
            Team library with {documents.length} documents • {userDocuments.length} uploaded by you
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiRefreshCw} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </motion.button>
          <motion.button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiUpload} />
            <span>Upload Documents</span>
          </motion.button>
        </div>
      </div>

      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <DocumentUpload onUploadComplete={() => setShowUpload(false)} />
        </motion.div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search team documents by name, content, or tags..."
        />

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiFolder} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500">Be the first to upload documents to the team library</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userDocuments.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-blue-100 p-1 rounded">
                    <SafeIcon icon={FiUsers} className="text-blue-600 text-sm" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Your Documents ({userDocuments.length})</h3>
                </div>
                <DocumentList
                  searchQuery={searchQuery}
                  documents={userDocuments}
                  showUploader={false}
                />
              </div>
            )}

            {otherDocuments.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-green-100 p-1 rounded">
                    <SafeIcon icon={FiUsers} className="text-green-600 text-sm" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Team Documents ({otherDocuments.length})</h3>
                </div>
                <DocumentList
                  searchQuery={searchQuery}
                  documents={otherDocuments}
                  showUploader={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLibrary;