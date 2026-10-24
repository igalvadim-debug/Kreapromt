type Props = {
  onSelect: (prompt: string) => void;
};

const examples = [
  {
    title: 'Scene Description',
    prompt: 'A lone astronaut standing on the surface of Mars, looking at Earth in the sky, during sunset',
    icon: '🚀',
  },
  {
    title: 'Design Task',
    prompt: 'Design a menu for an Italian restaurant called "Bella Vista" with sections for antipasti, pasta, and desserts',
    icon: '📋',
  },
  {
    title: 'Concept Visualization',
    prompt: 'A cozy reading nook in a treehouse library with warm lighting, bookshelves, and a cat sleeping on a cushion',
    icon: '📚',
  },
  {
    title: 'Product Design',
    prompt: 'A futuristic smartwatch with a holographic display showing a heart rate of 72 BPM, on a dark marble surface',
    icon: '⌚',
  },
  {
    title: 'Poster Design',
    prompt: 'A concert poster for "Midnight Jazz Festival" featuring a saxophone silhouette against a purple and gold gradient background',
    icon: '🎵',
  },
  {
    title: 'Architecture',
    prompt: 'A modern glass house on a cliff overlooking the ocean, with an infinity pool and tropical plants, at golden hour',
    icon: '🏠',
  },
];

export function ExamplePrompts({ onSelect }: Props) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Try an example
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {examples.map((example, i) => (
          <button
            key={i}
            onClick={() => onSelect(example.prompt)}
            className="text-left p-4 bg-[#12121a] border border-gray-800 hover:border-violet-500/30 rounded-xl transition-all duration-200 hover:bg-[#15151f] group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{example.icon}</span>
              <span className="text-xs font-medium text-gray-400 group-hover:text-violet-400 transition-colors">
                {example.title}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-400 transition-colors">
              {example.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
