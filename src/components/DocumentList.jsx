import React from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFile, FiTrash2, FiClock, FiTag, FiFileText, FiUser } = FiIcons;

const DocumentList = ({ searchQuery, documents, showUploader = false }) => {
  const { removeDocument, user } = useDocuments();

  const filteredDocuments = documents?.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  ) || [];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canDelete = (doc) => {
    return doc.uploaded_by === user?.email;
  };

  return (
    <div className="space-y-4">
      {filteredDocuments.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="bg-blue-100 p-2 rounded-lg">
                <SafeIcon icon={FiFile} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="text-xs" />
                    <span>{formatDate(doc.uploaded_at)}</span>
                  </span>
                  {showUploader && doc.uploaded_by && (
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="text-xs" />
                      <span>{doc.uploaded_by.split('@')[0]}</span>
                    </span>
                  )}
                  <span>{formatFileSize(doc.size)}</span>
                </div>
                {doc.summary && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {doc.summary}
                  </p>
                )}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    <SafeIcon icon={FiTag} className="text-xs text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{doc.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {canDelete(doc) && (
              <motion.button
                onClick={() => removeDocument(doc.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiTrash2} />
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}

      {filteredDocuments.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <SafeIcon icon={FiFileText} className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No documents match your search</p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;