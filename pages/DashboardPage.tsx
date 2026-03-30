
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, Download, ArrowRight, Inbox } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoftReveal, StaggerContainer, StaggerItem } from '../components/MotionWrapper';
import { getIcon } from '../constants';

const DashboardPage: React.FC = () => {
  const { state, dispatch, navigate, downloadJSON } = useApp();
  const { history } = state;

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-24">
      {/* Header */}
      <SoftReveal className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="pill bg-sage-50 text-sage-600 border border-sage-200 text-xs mb-4 inline-flex">
              <Clock size={12} />
              Your workspace
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-ink-900 leading-tight mt-2">
              Workflow <span className="text-sage-500 italic">history</span>
            </h1>
            <p className="text-ink-400 mt-2 font-light">
              {history.length} workflow{history.length !== 1 ? 's' : ''} generated
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="pill bg-ink-900 text-white font-medium text-sm shadow-lg shadow-ink-900/10 cursor-pointer"
            >
              New Workflow
              <ArrowRight size={14} />
            </motion.button>
            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
                className="pill border border-ink-200 text-ink-500 font-medium text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                Clear All
              </motion.button>
            )}
          </div>
        </div>
      </SoftReveal>

      {/* Empty State */}
      {history.length === 0 && (
        <SoftReveal delay={0.1}>
          <div className="float-card rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-warm-100 border border-warm-300 flex items-center justify-center mx-auto mb-6">
              <Inbox size={28} className="text-ink-300" />
            </div>
            <h3 className="text-xl font-semibold text-ink-900 mb-2">No workflows yet</h3>
            <p className="text-sm text-ink-400 mb-8 max-w-sm mx-auto">
              Generate your first workflow and it will appear here for easy access and re-download.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="pill bg-ink-900 text-white font-medium text-sm shadow-lg shadow-ink-900/10 cursor-pointer"
            >
              Create your first workflow
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </SoftReveal>
      )}

      {/* History List */}
      {history.length > 0 && (
        <StaggerContainer className="space-y-4">
          {history.map((entry) => (
            <StaggerItem key={entry.id}>
              <div className="elevated-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Workflow Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-ink-900 truncate">
                        {entry.workflow.title}
                      </h3>
                      <span className="pill bg-sage-50 text-sage-600 border border-sage-200 text-[10px] flex-shrink-0">
                        {entry.workflow.steps.length} steps
                      </span>
                    </div>
                    <p className="text-sm text-ink-400 truncate mb-3">{entry.workflow.summary}</p>

                    {/* Step Icons */}
                    <div className="flex items-center gap-1.5">
                      {entry.workflow.steps.slice(0, 5).map((step, si) => (
                        <div
                          key={step.id}
                          className="w-8 h-8 rounded-lg bg-warm-100 border border-warm-300 flex items-center justify-center text-ink-500"
                          title={step.name}
                        >
                          {getIcon(step.icon)}
                        </div>
                      ))}
                      {entry.workflow.steps.length > 5 && (
                        <span className="text-xs text-ink-300 ml-1">
                          +{entry.workflow.steps.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta + Actions */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs text-ink-300">{formatDate(entry.createdAt)}</span>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadJSON(entry.workflow)}
                        className="w-9 h-9 rounded-xl border border-ink-200 flex items-center justify-center text-ink-400 hover:text-sage-600 hover:border-sage-300 transition-colors cursor-pointer"
                        title="Download JSON"
                      >
                        <Download size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch({ type: 'REMOVE_HISTORY_ENTRY', payload: entry.id })}
                        className="w-9 h-9 rounded-xl border border-ink-200 flex items-center justify-center text-ink-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
};

export default DashboardPage;
