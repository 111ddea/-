export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  markdown: string;
  sources: Source[];
  recommendation?: 'BUY' | 'SELL' | 'HOLD' | 'UNKNOWN';
}

export interface StockInfo {
  code: string;
  name: string;
}
