import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const RecommendationBadge: React.FC<{ type: string }> = ({ type }) => {
  const colors = {
    BUY: 'bg-green-500/20 text-green-400 border-green-500/50',
    SELL: 'bg-red-500/20 text-red-400 border-red-500/50',
    HOLD: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    UNKNOWN: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  };

  const colorClass = colors[type as keyof typeof colors] || colors.UNKNOWN;

  return (
    <div className={`px-4 py-1.5 rounded-full border ${colorClass} font-bold text-sm tracking-wide shadow-sm inline-flex items-center gap-2`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${type === 'BUY' ? 'bg-green-400' : type === 'SELL' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${type === 'BUY' ? 'bg-green-500' : type === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
      </span>
      {type}
    </div>
  );
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  // Simple markdown processor to render content safely without external heavy libraries
  // This expects the specific format requested in the prompt but handles general markdown gracefully
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold text-white mt-6 mb-2">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-semibold text-slate-200 mt-5 mb-2 border-b border-slate-700 pb-1">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-medium text-slate-300 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      
      // List items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={index} className="ml-4 pl-2 text-slate-300 list-disc marker:text-blue-500">
             <span dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^[-*]\s/, '')) }} />
          </li>
        );
      }

      // Blockquote
      if (line.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-slate-900/50 text-slate-400 italic rounded-r">{line.replace('> ', '')}</blockquote>;
      }
      
      // Empty lines
      if (line.trim() === '') return <div key={index} className="h-4"></div>;

      // Regular paragraphs
      return (
        <p key={index} className="text-slate-400 mb-2 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
        </p>
      );
    });
  };

  const parseBold = (text: string) => {
    // Basic bold parsing for **text**
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analysis Report
          </h2>
          {result.recommendation && <RecommendationBadge type={result.recommendation} />}
        </div>
        
        <div className="markdown-body">
          {renderMarkdown(result.markdown)}
        </div>
      </div>

      {result.sources.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Sources & Grounding
          </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {result.sources.map((source, idx) => (
               <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all duration-200 group"
               >
                 <span className="text-xs font-mono text-slate-500 mt-1">{idx + 1}.</span>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-slate-300 group-hover:text-blue-400 truncate transition-colors">{source.title}</p>
                   <p className="text-xs text-slate-500 truncate mt-0.5">{source.uri}</p>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                 </svg>
               </a>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};
