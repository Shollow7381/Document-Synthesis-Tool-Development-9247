import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DocumentContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [synthesizedDocuments, setSynthesizedDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load documents when user is authenticated
  useEffect(() => {
    if (user) {
      loadDocuments();
      loadSynthesizedDocuments();
    } else {
      setDocuments([]);
      setSynthesizedDocuments([]);
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents_shared_lib')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      // Fallback to localStorage if Supabase fails
      const savedDocs = localStorage.getItem('documentLibrary');
      if (savedDocs) {
        setDocuments(JSON.parse(savedDocs));
      }
    }
  };

  const loadSynthesizedDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('synthesized_docs_shared_lib')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSynthesizedDocuments(data || []);
    } catch (error) {
      console.error('Error loading synthesized documents:', error);
      // Fallback to localStorage if Supabase fails
      const savedSynthesized = localStorage.getItem('synthesizedDocuments');
      if (savedSynthesized) {
        setSynthesizedDocuments(JSON.parse(savedSynthesized));
      }
    }
  };

  const addDocument = async (document) => {
    const newDoc = {
      ...document,
      uploaded_at: new Date().toISOString(),
      uploaded_by: user?.email || 'anonymous',
    };

    try {
      const { data, error } = await supabase
        .from('documents_shared_lib')
        .insert([newDoc])
        .select()
        .single();

      if (error) throw error;
      setDocuments(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding document:', error);
      // Fallback to localStorage
      const localDoc = { ...newDoc, id: Date.now().toString() };
      setDocuments(prev => [localDoc, ...prev]);
      localStorage.setItem('documentLibrary', JSON.stringify([localDoc, ...documents]));
    }
  };

  const removeDocument = async (id) => {
    try {
      const { error } = await supabase
        .from('documents_shared_lib')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error removing document:', error);
      // Fallback to local removal
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const addSynthesizedDocument = async (document) => {
    const newDoc = {
      ...document,
      created_at: new Date().toISOString(),
      created_by: user?.email || 'anonymous',
    };

    try {
      const { data, error } = await supabase
        .from('synthesized_docs_shared_lib')
        .insert([newDoc])
        .select()
        .single();

      if (error) throw error;
      setSynthesizedDocuments(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding synthesized document:', error);
      // Fallback to localStorage
      const localDoc = { ...newDoc, id: Date.now().toString() };
      setSynthesizedDocuments(prev => [localDoc, ...prev]);
      localStorage.setItem('synthesizedDocuments', JSON.stringify([localDoc, ...synthesizedDocuments]));
    }
  };

  const removeSynthesizedDocument = async (id) => {
    try {
      const { error } = await supabase
        .from('synthesized_docs_shared_lib')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSynthesizedDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error removing synthesized document:', error);
      // Fallback to local removal
      setSynthesizedDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const searchDocuments = (query) => {
    if (!query.trim()) return documents;
    
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    documents,
    synthesizedDocuments,
    isProcessing,
    setIsProcessing,
    user,
    isLoading,
    addDocument,
    removeDocument,
    addSynthesizedDocument,
    removeSynthesizedDocument,
    searchDocuments,
    signIn,
    signUp,
    signOut,
    loadDocuments,
    loadSynthesizedDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};