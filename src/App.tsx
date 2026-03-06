import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Clapperboard, 
  DollarSign, 
  TrendingUp, 
  Play, 
} from 'lucide-react';
import { Studio, MovieStatus, TeamMember } from './types';
import { createStudio, createMovie, simulateWeek } from './logic';
import { createUniverse } from './universe';
import { createFranchise } from './franchise';
import { loadGame, saveGame } from './core/saveSystem';
import { player } from './core/player';

// Components
import Navigation, { Screen } from './components/Navigation';
import Dashboard from './components/Dashboard';
import ProductionList from './components/ProductionList';
import StudioProfile from './components/StudioProfile';
import UniversesList from './components/UniversesList';
import FranchisesList from './components/FranchisesList';
import AwardsList from './components/AwardsList';
import FestivalsList from './components/FestivalsList';
import StatsView from './components/StatsView';
import PlayerProfile from './components/PlayerProfile';
import Sidebar from './components/Sidebar';
import CreateMovieForm from './components/CreateMovieForm';
import CreateUniverseForm from './components/CreateUniverseForm';
import CreateFranchiseForm from './components/CreateFranchiseForm';
import StudioSetup from './components/StudioSetup';
import ActorsDatabase from './components/ActorsDatabase';
import StaffHiringPanel from './components/StaffHiringPanel';
import { MovieLibrary } from './ui/movieLibrary';
import { ProductionView } from './ui/productionView';
import { SimulationControl } from './ui/simulationControl';
import { WeeklyReportModal } from './ui/weeklyReportModal';
import { AwardsDashboard } from './ui/awardsDashboard';
import { FestivalSubmission } from './ui/festivalSubmission';
import UniverseManager from './components/UniverseManager';
import RivalStudiosDashboard from './components/RivalStudiosDashboard';
import EconomyDashboard from './components/EconomyDashboard';
import MarketingPlanner from './components/MarketingPlanner';
import ReleaseStrategyPanel from './components/ReleaseStrategyPanel';
import EventCalendar from './components/EventCalendar';
import ThemeToggle from './components/ThemeToggle';
import TrailerPlayer from './components/TrailerPlayer';
import { playSound } from './utils/sounds';
import { SimulationReport, Movie } from './types';

export default function App() {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  
  // Modals
  const [isCreatingMovie, setIsCreatingMovie] = useState(false);
  const [isCreatingUniverse, setIsCreatingUniverse] = useState(false);
  const [isCreatingFranchise, setIsCreatingFranchise] = useState(false);

  // Initialize studio on first load
  useEffect(() => {
    loadGame();
    const saved = localStorage.getItem('movie-sim-studio');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStudio({
        ...parsed,
        universes: parsed.universes || [],
        franchises: parsed.franchises || [],
        characters: parsed.characters || [],
        projects: (parsed.projects || []).map((p: any) => ({
          ...p,
          criticScore: p.criticScore || 50 + Math.floor(Math.random() * 50),
          festivalScore: p.festivalScore || undefined,
          marketingCampaigns: p.marketingCampaigns || [],
          totalMarketingSpend: p.totalMarketingSpend || 0,
          streamingRevenue: p.streamingRevenue || 0,
          theatricalRevenue: p.theatricalRevenue || 0,
          releaseStrategy: p.releaseStrategy || 'Theatrical'
        })),
        awards: parsed.awards || [],
        festivals: parsed.festivals || [],
        monthlyProfit: parsed.monthlyProfit || [],
        activeEvents: parsed.activeEvents || [],
        valuation: parsed.valuation || parsed.money,
        rivals: parsed.rivals || [],
        staff: parsed.staff || [],
        notifications: parsed.notifications || [],
        initialized: parsed.initialized ?? true // Default true for existing saves
      });
    } else {
      // Create a template studio but mark as not initialized
      const initialStudio = createStudio("New Studio");
      setStudio({ ...initialStudio, initialized: false });
    }
  }, []);

  // Save studio state
  useEffect(() => {
    if (studio) {
      localStorage.setItem('movie-sim-studio', JSON.stringify(studio));
      // Sync player cash with studio money
      player.cash = studio.money;
      player.studioName = studio.name;
      player.stats.moviesProduced = studio.projects?.length || 0;
      player.stats.franchisesOwned = studio.franchises?.length || 0;
      player.stats.awardsWon = studio.awards?.length || 0;
      player.stats.totalBoxOffice = (studio.projects || []).reduce((acc, p) => acc + p.boxOffice, 0);
      saveGame();
    }
  }, [studio]);

  const handleStudioInit = (setupData: { name: string; logo: string; budget: number }) => {
    if (!studio) return;
    setStudio({
      ...studio,
      name: setupData.name,
      logo: setupData.logo,
      money: setupData.budget,
      initialized: true
    });
  };

  if (!studio) return null;

  if (!studio.initialized) {
    return <StudioSetup onComplete={handleStudioInit} />;
  }

  const handleCreateMovie = (
    title: string, 
    genres: string[], 
    budget: number, 
    universeId?: string, 
    franchiseId?: string,
    scenes: number = 60,
    runtime: number = 120,
    castIds: string[] = [],
    crew: Record<string, string> = {}
  ) => {
    const movie = createMovie(
      title, 
      genres,
      budget, 
      studio.currentWeek + 16, // Longer production cycle now
      universeId,
      franchiseId,
      scenes,
      runtime,
      castIds,
      crew
    );

    let updatedFranchises = [...studio.franchises];
    if (franchiseId) {
      updatedFranchises = studio.franchises.map(f => 
        f.id === franchiseId ? { ...f, projectIds: [...f.projectIds, movie.id] } : f
      );
    }

    setStudio({
      ...studio,
      money: studio.money - budget,
      projects: [...studio.projects, movie],
      franchises: updatedFranchises
    });
    setIsCreatingMovie(false);
  };

  const handleCreateUniverse = (name: string) => {
    const universe = createUniverse(name);
    setStudio({
      ...studio,
      universes: [...(studio.universes || []), universe]
    });
    setIsCreatingUniverse(false);
  };

  const handleCreateFranchise = (name: string, universeId: string) => {
    const franchise = createFranchise(name, universeId);
    const updatedUniverses = (studio.universes || []).map(u => 
      u.id === universeId ? { ...u, franchiseIds: [...u.franchiseIds, franchise.id] } : u
    );

    setStudio({
      ...studio,
      franchises: [...(studio.franchises || []), franchise],
      universes: updatedUniverses
    });
    setIsCreatingFranchise(false);
  };

  const handleHireStaff = (member: TeamMember) => {
    if (!studio) return;
    setStudio({
      ...studio,
      money: studio.money - member.salary,
      staff: [...studio.staff, member]
    });
  };

  const handleNextWeek = () => {
    playSound('click');
    setStudio(simulateWeek(studio));
  };

  const handleSimulationUpdate = (nextStudio: Studio, nextReport?: SimulationReport) => {
    playSound('notification');
    setStudio(nextStudio);
    if (nextReport) {
      setReport(nextReport);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans pb-24 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-zinc-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden">
              {studio.logo ? (
                <img src={studio.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <Clapperboard className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{studio.name}</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span className="text-amber-500">Prestige: {studio.reputation}</span>
                <span>•</span>
                <span>Week {studio.currentWeek}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold text-sm">
                {(studio.money / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <div key={activeScreen} className="space-y-8">
            {activeScreen === 'home' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Dashboard 
                      studio={studio} 
                      onNavigate={(s: any) => setActiveScreen(s === 'dashboard' ? 'home' : s)} 
                      onWatchTrailer={setPreviewMovie}
                    />
                  </div>
                  <div className="space-y-8">
                    <SimulationControl studio={studio} onUpdate={handleSimulationUpdate} />
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Quick Actions</h3>
                      <button 
                        onClick={() => setIsCreatingMovie(true)}
                        className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors mb-3"
                      >
                        Greenlight Project
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeScreen === 'production' && <ProductionView movies={studio.projects} />}
            {activeScreen === 'library' && <MovieLibrary movies={studio.projects} />}
            {activeScreen === 'festivals' && <FestivalSubmission studio={studio} onUpdate={setStudio} />}
            {activeScreen === 'distribution' && <AwardsDashboard studio={studio} />}
            {activeScreen === 'stats' && <StatsView studio={studio} onSimulate={handleNextWeek} hideHeader />}
            {activeScreen === 'profile' && <StudioProfile studio={studio} onHireStaff={handleHireStaff} />}
            {activeScreen === 'universes' && <UniverseManager studio={studio} onUpdateStudio={setStudio} />}
            {activeScreen === 'rankings' && <RivalStudiosDashboard studio={studio} />}
            {activeScreen === 'economy' && <EconomyDashboard studio={studio} />}
            {activeScreen === 'marketing' && <MarketingPlanner studio={studio} onUpdateStudio={setStudio} />}
            {activeScreen === 'release' && <ReleaseStrategyPanel studio={studio} onUpdateStudio={setStudio} />}
            {activeScreen === 'calendar' && <EventCalendar studio={studio} />}
            {activeScreen === 'actors' && <ActorsDatabase />}
            {activeScreen === 'staff' && <StaffHiringPanel studio={studio} onHire={handleHireStaff} />}
          </div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <Navigation activeScreen={activeScreen} onNavigate={setActiveScreen} />

      {/* Modals */}
      <AnimatePresence>
        {report && (
          <WeeklyReportModal report={report} onClose={() => setReport(null)} />
        )}
        {isCreatingMovie && (
          <CreateMovieForm 
            studio={studio} 
            onClose={() => setIsCreatingMovie(false)} 
            onCreate={handleCreateMovie} 
          />
        )}
        {isCreatingUniverse && (
          <CreateUniverseForm 
            onClose={() => setIsCreatingUniverse(false)} 
            onCreate={handleCreateUniverse} 
          />
        )}
        {isCreatingFranchise && (
          <CreateFranchiseForm 
            universes={studio.universes} 
            onClose={() => setIsCreatingFranchise(false)} 
            onCreate={handleCreateFranchise} 
          />
        )}
        {previewMovie && (
          <TrailerPlayer 
            movie={previewMovie} 
            onClose={() => setPreviewMovie(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
