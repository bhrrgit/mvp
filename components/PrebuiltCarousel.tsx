
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PREBUILT_FLOWS, EASE_OUT_EXPO } from '../constants';
import { SoftReveal } from './MotionWrapper';

const PrebuiltCarousel: React.FC = () => {
  return (
    <div className="w-full py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-8 flex items-end justify-between">
        <div>
          <SoftReveal>
            <span className="pill bg-warm-100 text-ink-400 border border-warm-300 text-xs mb-4 inline-flex">
              Templates
            </span>
          </SoftReveal>
          <SoftReveal delay={0.05}>
            <h3 className="font-display text-2xl md:text-3xl text-ink-900 mt-3">
              Popular <span className="text-sage-500 italic">workflows</span>
            </h3>
          </SoftReveal>
        </div>
        <SoftReveal delay={0.1}>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-ink-200 flex items-center justify-center text-ink-400 hover:text-ink-900 hover:border-ink-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="w-9 h-9 rounded-full border border-ink-200 flex items-center justify-center text-ink-400 hover:text-ink-900 hover:border-ink-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </SoftReveal>
      </div>

      <motion.div
        className="flex gap-5 px-6 md:px-10 overflow-x-auto no-scrollbar pb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.07,
              delayChildren: 0.15,
            }
          }
        }}
      >
        {PREBUILT_FLOWS.map((flow, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, x: 24 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: EASE_OUT_EXPO }
              }
            }}
            whileHover={{ y: -3 }}
            className="flex-shrink-0 w-72 elevated-card rounded-2xl p-6 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-5">
              <div className={`w-11 h-11 rounded-xl ${flow.accent} border flex items-center justify-center`}>
                {flow.icon}
              </div>
              <span className="pill bg-warm-100 text-ink-400 text-[10px] border border-warm-300">
                {flow.category}
              </span>
            </div>
            <h4 className="text-base font-semibold text-ink-900 mb-1.5 flex items-center gap-1.5">
              {flow.title}
              <ArrowUpRight size={14} className="text-ink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-sm text-ink-400 leading-relaxed">{flow.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PrebuiltCarousel;
