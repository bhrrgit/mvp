
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronRight, CheckCircle2, Code, Layout, ListChecks, ArrowLeft } from 'lucide-react';
import { GeneratedWorkflow } from '../types';
import { useApp } from '../context/AppContext';
import { SoftReveal } from './MotionWrapper';
import { GLOBAL_SPRING, EASE_OUT_EXPO, getIcon } from '../constants';

interface ResultViewProps {
  workflow: GeneratedWorkflow;
  onReset: () => void;
}

const tabs = [
  { id: 'visual', label: 'Visual Flow', icon: <Layout size={15} /> },
  { id: 'json', label: 'Raw Output', icon: <Code size={15} /> },
  { id: 'setup', label: 'Setup Guide', icon: <ListChecks size={15} /> }
] as const;

const ResultView: React.FC<ResultViewProps> = ({ workflow, onReset }) => {
  const { downloadJSON } = useApp();
  const [activeTab, setActiveTab] = useState<'visual' | 'json' | 'setup'>('visual');

  return (
    <SoftReveal className="w-full max-w-5xl mx-auto mt-16 mb-24 px-6 md:px-10">
      <div className="float-card rounded-3xl overflow-hidden">

        {/* ─── Header ─── */}
        <div className="p-8 md:p-10 border-b border-ink-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="pill bg-sage-50 text-sage-600 border border-sage-200 text-xs">
                  <CheckCircle2 size={12} />
                  Automation Ready
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-ink-900 mb-2">{workflow.title}</h2>
              <p className="text-ink-400 text-base leading-relaxed max-w-lg">{workflow.summary}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onReset}
                className="pill border border-ink-200 text-ink-600 font-medium text-sm hover:bg-ink-100 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                Try Another
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => downloadJSON(workflow)}
                className="pill bg-ink-900 text-white font-medium text-sm shadow-lg shadow-ink-900/10 cursor-pointer"
              >
                <Download size={14} />
                Get JSON
              </motion.button>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex border-b border-ink-100 px-8 md:px-10 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 text-sm font-medium transition-colors py-4 px-4 rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-ink-900'
                  : 'text-ink-300 hover:text-ink-600'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="resultActiveTab"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-ink-900 rounded-full"
                  transition={GLOBAL_SPRING}
                />
              )}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div className="p-8 md:p-10 min-h-[360px]">
          <AnimatePresence mode="wait">

            {/* Visual Flow */}
            {activeTab === 'visual' && (
              <motion.div
                key="visual"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 py-8"
              >
                {workflow.steps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={GLOBAL_SPRING}
                      className="w-full md:w-52 p-6 rounded-2xl bg-white border border-ink-100 flex flex-col items-center text-center group cursor-default elevated-card"
                    >
                      <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-100 text-sage-600 flex items-center justify-center mb-4 group-hover:bg-ink-900 group-hover:text-white transition-all duration-300">
                        {getIcon(step.icon)}
                      </div>
                      <h4 className="font-semibold text-ink-900 text-sm mb-1.5">{step.name}</h4>
                      <p className="text-xs text-ink-400 leading-relaxed">{step.description}</p>
                    </motion.div>
                    {idx < workflow.steps.length - 1 && (
                      <div className="text-ink-200 flex-shrink-0">
                        <ChevronRight className="rotate-90 md:rotate-0" size={24} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            )}

            {/* JSON Output */}
            {activeTab === 'json' && (
              <motion.div
                key="json"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.3 }}
                className="bg-ink-900 rounded-2xl p-6 md:p-8 font-mono text-sm leading-relaxed overflow-x-auto"
              >
                <pre className="text-sage-300 whitespace-pre-wrap">{workflow.jsonPreview}</pre>
              </motion.div>
            )}

            {/* Setup Guide */}
            {activeTab === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {workflow.setupGuide.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-ink-100 text-ink-600 flex items-center justify-center font-semibold text-xs flex-shrink-0 group-hover:bg-ink-900 group-hover:text-white transition-all duration-300">
                      {idx + 1}
                    </div>
                    <p className="text-ink-500 text-sm leading-relaxed pt-1.5">{item}</p>
                  </div>
                ))}

                <div className="mt-10 p-5 bg-sage-50 rounded-xl border border-sage-100 flex items-start gap-4">
                  <div className="w-8 h-8 bg-sage-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sage-800 text-sm">Pro Tip</h5>
                    <p className="text-xs text-sage-600 mt-0.5 leading-relaxed">
                      Store all credentials in n8n Global Variables for maximum security.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-8 flex items-center justify-center gap-8 text-xs text-ink-300 font-medium">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
          Import-Ready
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-lavender-400" />
          End-to-End
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ink-300" />
          Guided Setup
        </span>
      </div>
    </SoftReveal>
  );
};

export default ResultView;
