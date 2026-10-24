type Props = {
  currentStep: number;
};

const steps = [
  { id: 1, label: 'Analyzing core elements', icon: '🔍' },
  { id: 2, label: 'Applying generative reasoning', icon: '🧠' },
  { id: 3, label: 'Injecting aesthetic details', icon: '🎨' },
  { id: 4, label: 'Finalizing description', icon: '✨' },
];

export function WorkflowSteps({ currentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="animate-spin w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-400">Processing your prompt...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                step.id <= currentStep
                  ? 'bg-violet-500/10 border-violet-500/30'
                  : 'bg-[#0a0a0f] border-gray-800/50 opacity-40'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className={`text-xs ${step.id <= currentStep ? 'text-violet-300' : 'text-gray-600'}`}>
                {step.label}
              </span>
              {step.id < currentStep && (
                <svg className="w-3 h-3 text-green-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
