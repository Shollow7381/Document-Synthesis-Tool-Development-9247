import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import SearchBar from './SearchBar';
import DocumentViewer from './DocumentViewer';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiDownload, FiEye, FiTrash2, FiClock, FiLayers } = FiIcons;

const OutputManager = () => {
  const { synthesizedDocuments, removeSynthesizedDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const filteredDocuments = synthesizedDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.format.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLabels = {
    report: 'Research Report',
    summary: 'Executive Summary',
    memo: 'Business Memo',
    presentation: 'Presentation',
    article: 'Article',
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

  const downloadDocument = (doc) => {
    const content = `# ${doc.title}\n\n${doc.content}\n\n---\nGenerated: ${formatDate(doc.createdAt)}\nWord Count: ${doc.wordCount}\nFormat: ${formatLabels[doc.format]}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedDocument) {
    return (
      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onDownload={() => downloadDocument(selectedDocument)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Generated Documents</h2>
          <p className="text-gray-600 mt-1">
            View and manage your AI-synthesized documents ({synthesizedDocuments.length} documents)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search generated documents..."
        />

        {synthesizedDocuments.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiFileText} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No documents generated yet</h3>
            <p className="text-gray-500">Use the Synthesizer to create your first document</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <SafeIcon icon={FiFileText} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{doc.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <SafeIcon icon={FiClock} className="text-xs" />
                            <span>{formatDate(doc.created_at)}</span>
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {formatLabels[doc.format]}
                          </span>
                          <span>{doc.wordCount} words</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2"><strong>Source Facts:</strong></p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded border line-clamp-2">
                        {doc.sourceFacts}
                      </p>
                    </div>

                    {doc.sourceDocuments && doc.sourceDocuments.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <SafeIcon icon={FiLayers} className="text-xs text-gray-400" />
                          <span className="text-sm text-gray-600">
                            <strong>Source Documents:</strong>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {doc.sourceDocuments.map((sourceDoc, i) => (
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
                      onClick={() => setSelectedDocument(doc)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Document"
                    >
                      <SafeIcon icon={FiEye} />
                    </motion.button>
                    <motion.button
                      onClick={() => downloadDocument(doc)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Download Document"
                    >
                      <SafeIcon icon={FiDownload} />
                    </motion.button>
                    <motion.button
                      onClick={() => removeSynthesizedDocument(doc.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Document"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputManager;