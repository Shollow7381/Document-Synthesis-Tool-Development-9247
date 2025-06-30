import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUploadCloud, FiFile, FiCheck, FiX, FiLoader } = FiIcons;

const DocumentUpload = ({ onUploadComplete }) => {
  const { addDocument } = useDocuments();
  const [uploadStatus, setUploadStatus] = useState({});

  const processFile = async (file) => {
    const fileId = file.name + file.size;
    setUploadStatus(prev => ({ ...prev, [fileId]: 'processing' }));

    try {
      let content = '';
      
      if (file.type === 'text/plain') {
        content = await file.text();
      } else if (file.type === 'application/pdf') {
        // For demo purposes, we'll just extract basic info
        content = `PDF Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nUploaded: ${new Date().toLocaleString()}`;
      } else if (file.type.includes('word')) {
        // For demo purposes, basic Word document handling
        content = `Word Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nUploaded: ${new Date().toLocaleString()}`;
      } else if (file.type.includes('text') || file.name.endsWith('.md')) {
        content = await file.text();
      } else {
        throw new Error('Unsupported file type');
      }

      const document = {
        name: file.name,
        type: file.type,
        size: file.size,
        content,
        tags: extractTags(content),
        summary: generateSummary(content),
      };

      addDocument(document);
      setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));

      setTimeout(() => {
        setUploadStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[fileId];
          return newStatus;
        });
      }, 2000);

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
    }
  };

  const extractTags = (content) => {
    // Simple tag extraction based on common words
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const commonWords = ['the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they'];
    const uniqueWords = [...new Set(words)].filter(word => !commonWords.includes(word));
    return uniqueWords.slice(0, 5);
  };

  const generateSummary = (content) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(processFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <SafeIcon icon={FiUploadCloud} className="text-4xl text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              Drag & drop documents here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports: TXT, MD, PDF, DOC, DOCX
            </p>
          </div>
        )}
      </div>

      {Object.keys(uploadStatus).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadStatus).map(([fileId, status]) => (
            <motion.div
              key={fileId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <SafeIcon icon={FiFile} className="text-gray-400" />
              <span className="flex-1 text-sm text-gray-700 truncate">
                {fileId.split(/\d+$/)[0]}
              </span>
              {status === 'processing' && (
                <SafeIcon icon={FiLoader} className="text-blue-500 animate-spin" />
              )}
              {status === 'success' && (
                <SafeIcon icon={FiCheck} className="text-green-500" />
              )}
              {status === 'error' && (
                <SafeIcon icon={FiX} className="text-red-500" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;