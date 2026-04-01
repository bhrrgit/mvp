
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MousePointerClick, Workflow, ShieldCheck } from 'lucide-react';
import { WorkflowStatus } from '../types';
import { useApp } from '../context/AppContext';
import { SUGGESTIONS } from '../constants';
import PrebuiltCarousel from '../components/PrebuiltCarousel';
import LoadingState from '../components/LoadingState';
import ResultView from '../components/ResultView';
import PurchaseRequestForm from '../components/PurchaseRequestForm';
import { SoftReveal, StaggerContainer, StaggerItem } from '../components/MotionWrapper';

const features = [
  {
    icon: <MousePointerClick size={20} className="text-sage-500" />,
    title: "Describe it naturally",
    desc: "Skip the technical jargon. Just say what you need automated in plain language.",
    accent: "bg-sage-50 border-sage-100"
  },
  {
    icon: <Workflow size={20} className="text-lavender-500" />,
    title: "Import-ready workflows",
    desc: "Download complete n8n JSON files ready to import. Built in minutes, not weeks.",
    accent: "bg-lavender-50 border-lavender-100"
  },
  {
    icon: <ShieldCheck size={20} className="text-ink-500" />,
    title: "Guided configuration",
    desc: "Step-by-step instructions to set up credentials and connections securely.",
    accent: "bg-warm-100 border-warm-300"
  }
];

const HomePage: React.FC = () => {
  const { state, setPrompt, generateWorkflow, resetWorkflow } = useApp();
  const { prompt, status, currentWorkflow, error } = state;

  // Map WorkflowStatus to view state for AnimatePresence
  const viewState = status === WorkflowStatus.SUCCESS ? 'result'
    : status === WorkflowStatus.LOADING ? 'loading'
    : 'idle';

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    await generateWorkflow();
  }, [generateWorkflow]);

  const handleSuggestionClick = useCallback((text: string) => {
    setPrompt(text);
    // Auto-submit after filling
    generateWorkflow(text);
  }, [setPrompt, generateWorkflow]);

  return (
    <AnimatePresence mode="wait">

      {/* ═══════════ IDLE STATE ═══════════ */}
      {viewState === 'idle' && (
        <motion.section
          key="hero"
          className="w-full"
          exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
        >
          {/* Hero */}
          <div className="w-full max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 flex flex-col items-center text-center">
            <SoftReveal>
              <span className="pill bg-sage-50 text-sage-600 border border-sage-200 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                Trial Mode — 3 free workflows
              </span>
            </SoftReveal>

            <SoftReveal delay={0.05}>
              <h1 className="font-display text-5xl md:text-7xl lg:text-[5.2rem] text-ink-900 mb-6 leading-[1.08] tracking-tight max-w-4xl">
                Describe your automation.{' '}
                <span className="text-sage-500 italic">We'll build it.</span>
              </h1>
            </SoftReveal>

            <SoftReveal delay={0.1}>
              <p className="text-lg md:text-xl text-ink-400 max-w-2xl mx-auto leading-relaxed mb-14 font-light">
                Create AI-powered workflows for n8n using natural language.
                Turn ideas into complete, import-ready automations.
              </p>
            </SoftReveal>

            {/* Input Card */}
            <SoftReveal delay={0.15} className="w-full max-w-2xl">
              <div className="float-card rounded-3xl p-3">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What do you want to automate?"
                    className="flex-1 bg-transparent py-4 px-5 text-base md:text-lg outline-none text-ink-900 placeholder:text-ink-300 font-light"
                  />
                  <motion.button
                    type="submit"
                    disabled={!prompt.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                      prompt.trim()
                        ? 'bg-ink-900 text-white shadow-lg shadow-ink-900/10'
                        : 'bg-ink-100 text-ink-300 cursor-not-allowed'
                    }`}
                  >
                    Generate
                    <ArrowRight size={16} />
                  </motion.button>
                </form>

                {/* Suggestions */}
                <div className="mt-3 pt-3 border-t border-ink-100 flex flex-wrap gap-2 px-2 pb-1">
                  {SUGGESTIONS.map((tag, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggestionClick(tag)}
                      className="pill bg-warm-100 text-ink-500 text-xs border border-warm-300 hover:border-sage-200 hover:bg-sage-50 hover:text-sage-700 transition-all cursor-pointer"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </SoftReveal>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 text-red-500 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Features */}
          <div className="w-full max-w-6xl mx-auto px-6 md:px-10 pb-20">
            <SoftReveal delay={0.2}><div className="divider mb-16" /></SoftReveal>
            <SoftReveal delay={0.22}>
              <div className="flex items-center gap-3 mb-12">
                <span className="pill bg-lavender-50 text-lavender-500 border border-lavender-200 text-xs">How it works</span>
              </div>
            </SoftReveal>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <StaggerItem key={i}>
                  <div className="elevated-card rounded-2xl p-7 h-full">
                    <div className={`w-11 h-11 rounded-xl ${f.accent} border flex items-center justify-center mb-5`}>
                      {f.icon}
                    </div>
                    <h4 className="text-base font-semibold text-ink-900 mb-2">{f.title}</h4>
                    <p className="text-sm text-ink-400 leading-relaxed">{f.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <PrebuiltCarousel />

          {/* Bottom CTA */}
          <SoftReveal delay={0.1} className="w-full max-w-5xl mx-auto px-6 md:px-10 py-24">
            <div className="relative rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-ink-900" />
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sage-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-lavender-400/10 blur-3xl" />
              <div className="relative p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1">
                  <h3 className="font-display text-3xl md:text-4xl text-white mb-4 leading-tight">
                    Ready to automate{' '}<span className="text-sage-300 italic">your marketing?</span>
                  </h3>
                  <p className="text-ink-400 text-base max-w-md leading-relaxed">
                    Build your first 3 workflows free. No credit card, no technical setup required.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="px-7 py-4 bg-white text-ink-900 rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-lg">
                    Start your trial<ArrowRight size={16} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="px-7 py-4 bg-white/10 text-white hover:bg-white/15 rounded-2xl font-medium text-sm transition-colors border border-white/10">
                    Book a Demo
                  </motion.button>
                </div>
              </div>
            </div>

            <PurchaseRequestForm className="mt-7" />
          </SoftReveal>
        </motion.section>
      )}

      {/* ═══════════ LOADING STATE ═══════════ */}
      {viewState === 'loading' && (
        <motion.section
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full max-w-5xl mx-auto px-6 md:px-10 pt-24"
        >
          <div className="text-center mb-10">
            <span className="pill bg-lavender-50 text-lavender-500 border border-lavender-200 text-xs mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender-400 animate-pulse" />
              Processing
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-ink-900 mt-3">Architecting your workflow...</h2>
            <p className="text-ink-400 mt-3 text-base">Gemini is interpreting your automation logic.</p>
          </div>
          <LoadingState />
        </motion.section>
      )}

      {/* ═══════════ RESULT STATE ═══════════ */}
      {viewState === 'result' && currentWorkflow && (
        <motion.section
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center"
        >
          <ResultView workflow={currentWorkflow} onReset={resetWorkflow} />
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default HomePage;
