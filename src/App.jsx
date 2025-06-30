import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import DocumentLibrary from './components/DocumentLibrary';
import Synthesizer from './components/Synthesizer';
import OutputManager from './components/OutputManager';
import Auth from './components/Auth';
import { DocumentProvider, useDocuments } from './context/DocumentContext';

const AppContent = () => {
  const { user, isLoading } = useDocuments();
  const [currentView, setCurrentView] = useState('library');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your document library...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const views = {
    library: <DocumentLibrary />,
    synthesizer: <Synthesizer />,
    outputs: <OutputManager />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {views[currentView]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <DocumentProvider>
      <AppContent />
    </DocumentProvider>
  );
}

export default App;