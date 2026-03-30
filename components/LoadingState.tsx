
import React from 'react';
import { motion } from 'framer-motion';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto float-card rounded-3xl overflow-hidden">
      <div className="p-10 space-y-8">

        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-ink-100 animate-pulse" />
          <div className="space-y-2.5 flex-1">
            <div className="h-4 w-1/3 bg-ink-100 rounded-lg animate-pulse" />
            <div className="h-3 w-1/2 bg-warm-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Workflow steps skeleton */}
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
              className="h-36 bg-warm-100 rounded-2xl border border-dashed border-ink-200 flex flex-col items-center justify-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-ink-100 animate-pulse" />
              <div className="h-2.5 w-16 bg-ink-100 rounded-full animate-pulse" />
            </motion.div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-1/4 bg-ink-100 rounded-lg animate-pulse" />
          <div className="space-y-2.5">
            <div className="h-2.5 w-full bg-warm-200 rounded-full animate-pulse" />
            <div className="h-2.5 w-full bg-warm-200 rounded-full animate-pulse" />
            <div className="h-2.5 w-3/4 bg-warm-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex justify-end gap-3 pt-2">
          <div className="h-11 w-28 bg-ink-100 rounded-2xl animate-pulse" />
          <div className="h-11 w-40 bg-ink-200 rounded-2xl animate-pulse" />
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="h-1 bg-warm-200 overflow-hidden">
        <motion.div
          className="h-full bg-sage-400 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
};

export default LoadingState;
