import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiInfo } = FiIcons;

const FactInput = ({ facts, setFacts }) => {
  const suggestions = [
    "Recent market trends show a 15% increase in sustainable product demand",
    "New regulation XYZ-2024 requires compliance by Q2 2024",
    "Customer satisfaction scores improved by 23% after implementing new service protocol",
    "Competitor analysis reveals pricing strategy gap in premium segment",
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter New Facts or Information
        </label>
        <textarea
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
          placeholder="Enter the new facts, data, or information you want to synthesize with your document library..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Example Facts:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-blue-900 transition-colors"
                  onClick={() => setFacts(suggestion)}
                >
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <strong>Tip:</strong> Be specific and detailed. The more context you provide, the better the AI can synthesize relevant information from your documents.
      </div>
    </div>
  );
};

export default FactInput;