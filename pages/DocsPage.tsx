
import React from 'react';
import { BookOpen, ArrowUpRight, Code, Workflow, Key, FileJson } from 'lucide-react';
import { SoftReveal, StaggerContainer, StaggerItem } from '../components/MotionWrapper';

const sections = [
  {
    icon: <Workflow size={20} className="text-sage-500" />,
    title: 'Getting Started',
    description: 'Learn how to describe your first automation and generate a workflow in seconds.',
    accent: 'bg-sage-50 border-sage-100',
  },
  {
    icon: <Key size={20} className="text-lavender-500" />,
    title: 'API Key Setup',
    description: 'Configure your Gemini API key in .env.local to power the AI workflow engine.',
    accent: 'bg-lavender-50 border-lavender-100',
  },
  {
    icon: <FileJson size={20} className="text-ink-500" />,
    title: 'Importing to n8n',
    description: 'How to take the generated JSON and import it directly into your n8n instance.',
    accent: 'bg-warm-100 border-warm-300',
  },
  {
    icon: <Code size={20} className="text-amber-600" />,
    title: 'Advanced Prompting',
    description: 'Tips for writing better prompts that produce more accurate and complete workflows.',
    accent: 'bg-amber-50 border-amber-100',
  },
];

const DocsPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-24">
      <SoftReveal className="mb-16">
        <span className="pill bg-warm-100 text-ink-400 border border-warm-300 text-xs mb-6 inline-flex">
          <BookOpen size={12} />
          Documentation
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-ink-900 mb-4 leading-tight mt-2">
          Learn <span className="text-sage-500 italic">MarketerAI</span>
        </h1>
        <p className="text-lg text-ink-400 max-w-xl font-light">
          Everything you need to get up and running with automated workflow generation.
        </p>
      </SoftReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <StaggerItem key={section.title}>
            <div className="elevated-card rounded-2xl p-7 h-full group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${section.accent} border flex items-center justify-center`}>
                  {section.icon}
                </div>
                <ArrowUpRight size={16} className="text-ink-200 group-hover:text-ink-500 transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-ink-900 mb-2">{section.title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{section.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <SoftReveal delay={0.3} className="mt-16">
        <div className="float-card rounded-2xl p-8">
          <h3 className="font-semibold text-ink-900 mb-4">Quick Start</h3>
          <div className="bg-ink-900 rounded-xl p-5 font-mono text-sm leading-relaxed overflow-x-auto">
            <pre className="text-sage-300">
{`# 1. Clone the project
git clone https://github.com/marketerai/trial.git

# 2. Set your API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Install & run
npm install
npm run dev`}
            </pre>
          </div>
        </div>
      </SoftReveal>
    </div>
  );
};

export default DocsPage;
