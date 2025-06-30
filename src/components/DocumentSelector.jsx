import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import SearchBar from './SearchBar';
import * as FiIcons from 'react-icons/fi';

const { FiFile, FiCheck, FiFolder } = FiIcons;

const DocumentSelector = ({ documents, selectedDocuments, setSelectedDocuments }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleDocument = (docId) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAll = () => {
    setSelectedDocuments(filteredDocuments.map(doc => doc.id));
  };

  const selectNone = () => {
    setSelectedDocuments([]);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <SafeIcon icon={FiFolder} className="text-4xl text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No documents available</p>
        <p className="text-sm text-gray-400 mt-1">Upload documents to your library first</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search documents to include..."
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {selectedDocuments.length} of {filteredDocuments.length} selected
        </span>
        <div className="space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={selectNone}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Select None
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredDocuments.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
              selectedDocuments.includes(doc.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleDocument(doc.id)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              selectedDocuments.includes(doc.id)
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {selectedDocuments.includes(doc.id) && (
                <SafeIcon icon={FiCheck} className="text-white text-xs" />
              )}
            </div>
            <SafeIcon icon={FiFile} className="text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{doc.name}</p>
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSelector;