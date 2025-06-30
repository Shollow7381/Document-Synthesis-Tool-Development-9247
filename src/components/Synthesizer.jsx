import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import FactInput from './FactInput';
import DocumentSelector from './DocumentSelector';
import SynthesisEngine from './SynthesisEngine';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiBookOpen, FiTarget } = FiIcons;

const Synthesizer = () => {
  const { documents } = useDocuments();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [facts, setFacts] = useState('');
  const [outputFormat, setOutputFormat] = useState('report');
  const [isGenerating, setIsGenerating] = useState(false);

  const outputFormats = [
    { id: 'report', label: 'Research Report', description: 'Comprehensive analysis with citations' },
    { id: 'summary', label: 'Executive Summary', description: 'Concise overview with key points' },
    { id: 'memo', label: 'Business Memo', description: 'Professional memo format' },
    { id: 'presentation', label: 'Presentation Outline', description: 'Structured slides with talking points' },
    { id: 'article', label: 'Article', description: 'Publication-ready article format' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Document Synthesizer</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Input new facts and let AI synthesize them with your document library to create comprehensive, formatted documents
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Facts Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <SafeIcon icon={FiTarget} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Input Facts</h3>
            </div>
            <FactInput facts={facts} setFacts={setFacts} />
          </motion.div>

          {/* Document Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <SafeIcon icon={FiBookOpen} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Select Source Documents</h3>
            </div>
            <DocumentSelector
              documents={documents}
              selectedDocuments={selectedDocuments}
              setSelectedDocuments={setSelectedDocuments}
            />
          </motion.div>
        </div>

        {/* Configuration & Generation */}
        <div className="space-y-6">
          {/* Output Format */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Output Format</h3>
            <div className="space-y-3">
              {outputFormats.map((format) => (
                <label
                  key={format.id}
                  className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                    outputFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="outputFormat"
                    value={format.id}
                    checked={outputFormat === format.id}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900">{format.label}</div>
                  <div className="text-sm text-gray-500">{format.description}</div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SynthesisEngine
              facts={facts}
              selectedDocuments={selectedDocuments}
              outputFormat={outputFormat}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Synthesizer;