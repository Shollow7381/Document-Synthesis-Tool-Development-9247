import React from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiLoader, FiAlertCircle } = FiIcons;

const SynthesisEngine = ({ facts, selectedDocuments, outputFormat, isGenerating, setIsGenerating }) => {
  const { documents, addSynthesizedDocument } = useDocuments();

  const canGenerate = facts.trim() && selectedDocuments.length > 0;

  const generateDocument = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
      const synthesizedContent = await synthesizeContent(facts, selectedDocs, outputFormat);

      const newDocument = {
        title: generateTitle(facts, outputFormat),
        content: synthesizedContent,
        format: outputFormat,
        sourceFacts: facts,
        sourceDocuments: selectedDocs.map(doc => ({ id: doc.id, name: doc.name })),
        wordCount: synthesizedContent.split(/\s+/).length,
      };

      addSynthesizedDocument(newDocument);
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const synthesizeContent = async (facts, sourceDocs, format) => {
    // This is a simulation of AI synthesis
    const templates = {
      report: generateReport(facts, sourceDocs),
      summary: generateSummary(facts, sourceDocs),
      memo: generateMemo(facts, sourceDocs),
      presentation: generatePresentation(facts, sourceDocs),
      article: generateArticle(facts, sourceDocs),
    };

    return templates[format] || templates.report;
  };

  const generateTitle = (facts, format) => {
    const formatTitles = {
      report: 'Comprehensive Analysis Report',
      summary: 'Executive Summary',
      memo: 'Strategic Memo',
      presentation: 'Presentation Overview',
      article: 'Analytical Article',
    };

    const key = facts.split(' ').slice(0, 3).join(' ');
    return `${formatTitles[format]}: ${key}`;
  };

  const generateReport = (facts, sourceDocs) => {
    return `# Comprehensive Analysis Report

## Executive Summary

Based on the analysis of ${sourceDocs.length} source documents and the provided facts, this report synthesizes key insights and recommendations.

## Key Facts

${facts}

## Analysis

The information provided aligns with several key themes identified in the source documents:

${sourceDocs.map(doc => `
### Insights from "${doc.name}"

${doc.summary || 'This document provides relevant context and supporting information for the analysis.'}

**Key Tags:** ${doc.tags ? doc.tags.join(', ') : 'No tags available'}
`).join('\n')}

## Synthesis and Recommendations

1. **Primary Finding**: The facts presented suggest significant implications for strategic decision-making.

2. **Supporting Evidence**: Cross-referencing with the document library reveals consistent patterns and validation points.

3. **Strategic Implications**: These findings should inform future planning and resource allocation.

## Conclusion

The synthesis of new facts with existing documentation provides a comprehensive foundation for informed decision-making.

---
*Generated on ${new Date().toLocaleString()} using ${sourceDocs.length} source documents*`;
  };

  const generateSummary = (facts, sourceDocs) => {
    return `# Executive Summary

## Overview

This summary synthesizes new information with insights from ${sourceDocs.length} source documents to provide actionable intelligence.

## Key Points

• ${facts.split('.')[0]}
• Analysis supported by comprehensive document review
• Strategic implications identified across multiple domains

## Source Integration

${sourceDocs.map(doc => `• ${doc.name}: ${doc.tags ? doc.tags.slice(0, 2).join(', ') : 'Supporting data'}`).join('\n')}

## Recommendations

1. Immediate action required based on new facts
2. Continuous monitoring of related indicators
3. Strategic alignment with existing initiatives

---
*Executive Summary | ${new Date().toLocaleDateString()}*`;
  };

  const generateMemo = (facts, sourceDocs) => {
    return `**MEMORANDUM**

**TO:** Leadership Team
**FROM:** Document Synthesis System
**DATE:** ${new Date().toLocaleDateString()}
**RE:** Strategic Intelligence Update

## Purpose

This memo synthesizes recent facts with our document library to provide strategic guidance.

## Background

${facts}

## Analysis

Based on review of ${sourceDocs.length} relevant documents, the following patterns emerge:

${sourceDocs.map((doc, i) => `${i + 1}. **${doc.name}**: Provides context on ${doc.tags ? doc.tags[0] : 'relevant topics'}`).join('\n')}

## Recommendations

- **Immediate**: Review and validate findings
- **Short-term**: Develop action plan based on synthesis
- **Long-term**: Monitor for additional related developments

## Next Steps

Please review this synthesis and provide feedback for further analysis.`;
  };

  const generatePresentation = (facts, sourceDocs) => {
    return `# Presentation Outline

## Slide 1: Title
**Topic**: Strategic Intelligence Brief
**Date**: ${new Date().toLocaleDateString()}

## Slide 2: Key Facts
${facts}

## Slide 3: Source Analysis
- **Documents Reviewed**: ${sourceDocs.length}
- **Key Themes**: ${sourceDocs.flatMap(doc => doc.tags || []).slice(0, 5).join(', ')}

## Slide 4: Synthesis Points
${sourceDocs.map((doc, i) => `${i + 1}. ${doc.name} - Supporting evidence`).join('\n')}

## Slide 5: Strategic Implications
- Impact on current operations
- Future planning considerations
- Risk and opportunity assessment

## Slide 6: Recommendations
1. Immediate actions
2. Strategic planning updates
3. Monitoring protocols

## Slide 7: Next Steps
- Review and validation
- Implementation planning
- Follow-up timeline

---
*Speaker Notes: Use this outline to develop detailed slides with supporting visuals*`;
  };

  const generateArticle = (facts, sourceDocs) => {
    return `# Strategic Intelligence: New Developments and Analysis

*Published ${new Date().toLocaleDateString()}*

## Introduction

Recent developments have provided new insights that, when analyzed against our comprehensive document library, reveal important strategic implications.

## Key Developments

${facts}

## Analysis Framework

This analysis draws upon ${sourceDocs.length} source documents to provide context and validation:

${sourceDocs.map(doc => `
**${doc.name}**

${doc.summary || 'This document contributes valuable perspective to our analysis.'}

*Keywords: ${doc.tags ? doc.tags.join(', ') : 'General analysis'}*
`).join('\n')}

## Strategic Synthesis

The integration of new facts with existing knowledge reveals several critical insights:

1. **Pattern Recognition**: Consistent themes emerge across multiple sources
2. **Validation Points**: New information aligns with documented trends
3. **Strategic Implications**: Clear pathways for decision-making

## Conclusion

This synthesis demonstrates the value of combining new intelligence with comprehensive documentation. The resulting analysis provides a robust foundation for strategic planning and tactical implementation.

---
*Article generated through AI synthesis of ${sourceDocs.length} source documents*`;
  };

  return (
    <div className="space-y-4">
      {!canGenerate && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertCircle} className="text-amber-600" />
            <p className="text-sm text-amber-800">
              Please enter facts and select at least one document to generate
            </p>
          </div>
        </div>
      )}

      <motion.button
        onClick={generateDocument}
        disabled={!canGenerate || isGenerating}
        className={`w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-3 transition-all ${
          canGenerate && !isGenerating
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={canGenerate && !isGenerating ? { scale: 1.02 } : {}}
        whileTap={canGenerate && !isGenerating ? { scale: 0.98 } : {}}
      >
        {isGenerating ? (
          <>
            <SafeIcon icon={FiLoader} className="animate-spin" />
            <span>Synthesizing Document...</span>
          </>
        ) : (
          <>
            <SafeIcon icon={FiZap} />
            <span>Generate Document</span>
          </>
        )}
      </motion.button>

      {canGenerate && (
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Facts:</strong> {facts.slice(0, 100)}...</p>
          <p><strong>Sources:</strong> {selectedDocuments.length} documents selected</p>
          <p><strong>Format:</strong> {outputFormat}</p>
        </div>
      )}
    </div>
  );
};

export default SynthesisEngine;