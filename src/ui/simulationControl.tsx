import React, { useState } from "react";
import { Play, FastForward, Pause, Calendar } from "lucide-react";
import { Studio, SimulationReport } from "../types";
import { simulateWeeks, simulateWeek } from "../logic";

interface SimulationControlProps {
  studio: Studio;
  onUpdate: (studio: Studio, report?: SimulationReport) => void;
}

export const SimulationControl: React.FC<SimulationControlProps> = ({ studio, onUpdate }) => {
  const [weeksToSimulate, setWeeksToSimulate] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    // Add a small delay for feel
    setTimeout(() => {
      const { studio: nextStudio, report } = simulateWeeks(studio, weeksToSimulate);
      onUpdate(nextStudio, report);
      setIsSimulating(false);
    }, 500);
  };

  const handleNextWeek = () => {
    const nextStudio = simulateWeek(studio);
    onUpdate(nextStudio);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Time Management</h3>
            <p className="text-xs text-white/50">Current Week: {studio.currentWeek}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextWeek}
            disabled={isSimulating}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            title="Next Week"
          >
            <Play className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
            Simulate Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 4, 12, 26].map((w) => (
              <button
                key={w}
                onClick={() => setWeeksToSimulate(w)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  weeksToSimulate === w
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {w}w
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
        >
          {isSimulating ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <FastForward className="w-5 h-5" />
              Simulate {weeksToSimulate} Weeks
            </>
          )}
        </button>
      </div>
    </div>
  );
};
