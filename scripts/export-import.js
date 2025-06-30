// Add this functionality to your app for sharing document libraries

export const exportLibrary = (documents, synthesizedDocuments) => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    documents: documents,
    synthesizedDocuments: synthesizedDocuments,
    metadata: {
      totalDocuments: documents.length,
      totalSynthesized: synthesizedDocuments.length
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `document-library-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importLibrary = (file, addDocument, addSynthesizedDocument) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate import data
        if (!importData.version || !importData.documents) {
          throw new Error('Invalid library file format');
        }

        // Import documents
        importData.documents.forEach(doc => {
          addDocument({ ...doc, id: Date.now() + Math.random() });
        });

        // Import synthesized documents
        if (importData.synthesizedDocuments) {
          importData.synthesizedDocuments.forEach(doc => {
            addSynthesizedDocument({ ...doc, id: Date.now() + Math.random() });
          });
        }

        resolve({
          imported: importData.documents.length,
          synthesized: importData.synthesizedDocuments?.length || 0
        });
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};