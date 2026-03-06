import React from "react";
import { X, TrendingUp, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { SimulationReport } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface WeeklyReportModalProps {
  report: SimulationReport | null;
  onClose: () => void;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-bottom border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
            <div>
              <h2 className="text-2xl font-bold text-white">Simulation Report</h2>
              <p className="text-sm text-white/50">{report.weeksSimulated} weeks elapsed</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white/70" />
            </button>
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  ${report.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Awards Won</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {report.awardsWon.length}
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Production Updates</h3>
              <div className="space-y-3">
                {report.projectProgress.map((p, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                    <div>
                      <div className="text-white font-semibold">{p.title}</div>
                      <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                        <span>{p.startStatus}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-indigo-400 font-medium">{p.endStatus}</span>
                      </div>
                    </div>
                    {p.progressGained > 0 && (
                      <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                        +{Math.round(p.progressGained)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            {report.milestones.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Key Milestones</h3>
                <div className="space-y-2">
                  {report.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5">
            <button
              onClick={onClose}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-indigo-50 transition-colors"
            >
              Acknowledge & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
