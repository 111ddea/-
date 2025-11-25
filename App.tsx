import React, { useState, useEffect, useRef } from 'react';
import { StockForm } from './components/StockForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeStock } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to ensure auto-analysis only runs once
  const hasAutoRun = useRef(false);

  // Default to the user's requested stock
  const [defaultStock] = useState({
    name: "京东集团-sw",
    code: "09618"
  });

  const handleAnalyze = async (name: string, code: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeStock(name, code);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically run analysis for the default stock on load
  useEffect(() => {
    if (!hasAutoRun.current) {
      handleAnalyze(defaultStock.name, defaultStock.code);
      hasAutoRun.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 pb-20">
      <header className="pt-12 pb-8 px-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-slate-900/50 rounded-2xl border border-slate-800 mb-6 shadow-inner">
           <span className="text-3xl mr-3">📈</span>
           <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
             AI Stock Analyst
           </h1>
        </div>
        <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
          Get real-time market insights, financial health checks, and investment recommendations powered by AI.
        </p>
      </header>

      <main className="container mx-auto px-4">
        <StockForm 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          initialName={defaultStock.name}
          initialCode={defaultStock.code}
        />

        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-8 text-center animate-fade-in">
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        )}

        {result && (
          <AnalysisDisplay result={result} />
        )}

        {!result && !isLoading && !error && (
          <div className="max-w-2xl mx-auto text-center mt-12 opacity-50">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-slate-800 border-dashed rounded-full flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <p className="text-slate-600">Enter a stock name or code above to generate a report.</p>
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 w-full bg-slate-950/80 backdrop-blur border-t border-slate-900 py-3 text-center text-xs text-slate-600 z-10">
        AI responses can be inaccurate. Always verify financial data.
      </footer>
    </div>
  );
};

export default App;