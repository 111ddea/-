import React, { useState } from 'react';

interface StockFormProps {
  onAnalyze: (name: string, code: string) => void;
  isLoading: boolean;
  initialCode?: string;
  initialName?: string;
}

export const StockForm: React.FC<StockFormProps> = ({ onAnalyze, isLoading, initialCode = '', initialName = '' }) => {
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(initialCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && code.trim()) {
      onAnalyze(name, code);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
           <label htmlFor="stockName" className="block text-sm font-medium text-slate-400 mb-1.5">Stock Name</label>
           <input
            id="stockName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. JD.com, Apple"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
           />
        </div>
        <div>
           <label htmlFor="stockCode" className="block text-sm font-medium text-slate-400 mb-1.5">Stock Code / Ticker</label>
           <input
            id="stockCode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 09618, 9618.HK"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
           />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2
          ${isLoading 
            ? 'bg-slate-700 cursor-not-allowed opacity-75' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 active:scale-[0.98]'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Market Data...
          </>
        ) : (
          <>
            Run AI Analysis
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </>
        )}
      </button>
      
      <p className="text-xs text-center text-slate-500 mt-4">
        Powered by Gemini 2.5 Flash & Google Search Grounding. Not financial advice.
      </p>
    </form>
  );
};
