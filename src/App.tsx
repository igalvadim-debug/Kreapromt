import { useState, useCallback } from 'react';
import { PromptAnalyzer } from './components/PromptAnalyzer';
import { OutputDisplay } from './components/OutputDisplay';
import { WorkflowSteps } from './components/WorkflowSteps';
import { ExamplePrompts } from './components/ExamplePrompts';
import { generateVisualDescription } from './utils/promptEngine';

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

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setResult(null);
    setCurrentStep(1);

    // Simulate processing steps with delays for UX
    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3);
        setTimeout(() => {
          setCurrentStep(4);
          setTimeout(() => {
            const analysisResult = generateVisualDescription(prompt);
            setResult(analysisResult);
            setIsProcessing(false);
            setCurrentStep(0);
          }, 600);
        }, 500);
      }, 500);
    }, 400);
  }, [prompt]);

  const handleExampleSelect = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm bg-[#0a0a0f]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Visual Description Generator
            </h1>
            <p className="text-xs text-gray-500">Transform prompts into precise image descriptions</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            From Idea to Visual Blueprint
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Enter any prompt and receive a structured, professional-grade visual description
            ready for text-to-image generation. Every element analyzed, every detail specified.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to see... (e.g., 'A cat sitting on a windowsill watching rain' or 'Design a poster for a jazz concert')"
              className="w-full h-36 px-5 py-4 bg-[#12121a] border border-gray-800 rounded-2xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all text-sm md:text-base"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <span className="text-xs text-gray-600">{prompt.length} chars</span>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isProcessing}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 disabled:shadow-none"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Generate Description'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        {isProcessing && <WorkflowSteps currentStep={currentStep} />}

        {/* Example Prompts */}
        {!result && !isProcessing && (
          <ExamplePrompts onSelect={handleExampleSelect} />
        )}

        {/* Results */}
        {result && (
          <PromptAnalyzer result={result} />
        )}

        {/* Output */}
        {result && (
          <OutputDisplay description={result.enhancedDescription} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-600">
          <p>Visual Description Generator — Structured prompt analysis for text-to-image models</p>
          <p className="mt-1">Core elements locked • Generative reasoning applied • Professional aesthetics injected • Text elements specified</p>
        </div>
      </footer>
    </div>
  );
}
