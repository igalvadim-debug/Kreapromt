import { AnalysisResult } from '../types';

type Props = {
  result: AnalysisResult;
};

export function PromptAnalyzer({ result }: Props) {
  const { coreElements, requiresGenerativeReasoning, generativeSolution } = result;

  return (
    <div className="mb-8 space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </span>
        Prompt Analysis
      </h3>

      {/* Core Elements */}
      <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4">
          Step 1: Core Elements (Locked)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ElementCard label="Subject" value={coreElements.subject} icon="🎯" />
          <ElementCard label="Quantity" value={coreElements.quantity} icon="🔢" />
          <ElementCard label="Action" value={coreElements.action} icon="⚡" />
          <ElementCard label="State" value={coreElements.state} icon="📐" />
        </div>
        {coreElements.ipNames.length > 0 && (
          <div className="mt-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider">IP/Names: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {coreElements.ipNames.map((name: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg text-xs text-fuchsia-300">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
        {coreElements.colors.length > 0 && (
          <div className="mt-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Colors: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {coreElements.colors.map((color: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
        {coreElements.textElements.length > 0 && (
          <div className="mt-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Text in Image: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {coreElements.textElements.map((text: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 font-mono">
                  "{text}"
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generative Reasoning */}
      {requiresGenerativeReasoning && (
        <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider mb-3">
            Step 2: Generative Reasoning
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {generativeSolution}
          </p>
        </div>
      )}
    </div>
  );
}

function ElementCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#0a0a0f] rounded-xl border border-gray-800/50">
      <span className="text-lg">{icon}</span>
      <div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        <p className="text-sm text-gray-200 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}
