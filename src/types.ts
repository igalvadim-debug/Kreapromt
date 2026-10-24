export type AnalysisResult = {
  coreElements: {
    subject: string;
    quantity: string;
    action: string;
    state: string;
    ipNames: string[];
    colors: string[];
    textElements: string[];
  };
  requiresGenerativeReasoning: boolean;
  generativeSolution: string;
  enhancedDescription: string;
};
