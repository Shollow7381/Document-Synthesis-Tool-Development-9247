import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDownload, FiClock, FiLayers, FiFileText } = FiIcons;

const DocumentViewer = ({ document, onClose, onDownload }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLabels = {
    report: 'Research Report',
    summary: 'Executive Summary',
    memo: 'Business Memo',
    presentation: 'Presentation',
    article: 'Article',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <SafeIcon icon={FiFileText} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{document.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="text-xs" />
                      <span>{formatDate(document.created_at)}</span>
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {formatLabels[document.format]}
                    </span>
                    <span>{document.wordCount} words</span>
                  </div>
                </div>
              </div>

              {document.sourceDocuments && document.sourceDocuments.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiLayers} className="text-xs text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">Source Documents:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {document.sourceDocuments.map((sourceDoc, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {sourceDoc.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 ml-4">
              <motion.button
                onClick={onDownload}
                className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Download Document"
              >
                <SafeIcon icon={FiDownload} className="text-lg" />
              </motion.button>
              <motion.button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiX} className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {document.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            <strong>Source Facts:</strong>
          </div>
          <div className="mt-2 p-3 bg-white rounded border text-sm text-gray-700">
            {document.sourceFacts}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentViewer;