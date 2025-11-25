import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStock = async (stockName: string, stockCode: string): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Role: You are a senior financial analyst and investment advisor.
    Task: Conduct a comprehensive analysis of the stock "${stockName}" (Code: ${stockCode}).
    
    Instructions:
    1. Use Google Search to find the latest stock price, recent market trends (last 7-30 days), and major news impacting the company.
    2. **Deep Dive Financial Analysis**: You MUST specifically analyze the following 5 key indicators. For each, provide the latest data, **explain what the indicator means** (for an investor learning finance), and **interpret what it implies** for this specific stock:
       - **Price-to-Earnings Ratio (PE Ratio / 市盈率)**
       - **Price-to-Book Ratio (PB Ratio / 市净率)**
       - **Revenue Growth Rate (营收增长率)**
       - **Net Profit Margin (净利润率)**
       - **Dividend Yield (股息率)**
    3. Identify specific risks (e.g., regulatory changes, e-commerce competition) and opportunities.
    4. Provide a definitive recommendation: "BUY", "SELL", or "HOLD".
    5. Format the output in clean Markdown.
    
    Structure your response as follows:
    # Executive Summary
    (A brief summary of the investment thesis)
    
    # Financial Indicators Analysis
    (The detailed 5-point analysis requested above with definitions and implications)
    
    # Market Context & News
    (Recent price action and key events)
    
    # Investment Verdict
    (State clearly: BUY, SELL, or HOLD, followed by your reasoning)
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType and responseSchema are NOT allowed with googleSearch
      },
    });

    const text = response.text || "No analysis generated.";
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    // Simple heuristic to extract recommendation for UI badging
    let recommendation: 'BUY' | 'SELL' | 'HOLD' | 'UNKNOWN' = 'UNKNOWN';
    const lowerText = text.toLowerCase();
    
    // Look for explicit recommendation
    if (lowerText.includes('recommendation: buy') || lowerText.includes('verdict: buy') || lowerText.includes('buy')) {
        // Simple check to ensure it's not "don't buy" - usually the summary format is strict enough
        if (lowerText.includes('strong buy')) recommendation = 'BUY';
        else if (lowerText.includes('buy')) recommendation = 'BUY';
    }
    
    if (lowerText.includes('recommendation: sell') || lowerText.includes('verdict: sell')) {
      recommendation = 'SELL';
    } else if (lowerText.includes('recommendation: hold') || lowerText.includes('recommendation: neutral') || lowerText.includes('verdict: hold')) {
      recommendation = 'HOLD';
    }

    // Fallback if the simple includes matched too broadly
    if (lowerText.includes('recommendation: buy') || lowerText.includes('verdict: buy')) recommendation = 'BUY';
    if (lowerText.includes('recommendation: sell') || lowerText.includes('verdict: sell')) recommendation = 'SELL';
    if (lowerText.includes('recommendation: hold') || lowerText.includes('verdict: hold')) recommendation = 'HOLD';

    return {
      markdown: text,
      sources,
      recommendation
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze stock. Please try again later.");
  }
};