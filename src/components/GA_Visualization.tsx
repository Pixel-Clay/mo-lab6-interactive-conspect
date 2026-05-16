import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Zap } from 'lucide-react';
import { City, Individual } from '../types';
import { 
  generateInitialPopulation, 
  calculatePathDistance, 
  tournamentSelection, 
  orderCrossover, 
  mutate 
} from '../lib/algorithms';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const GA_Visualization: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [population, setPopulation] = useState<Individual[]>([]);
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [bestDistance, setBestDistance] = useState<number | null>(null);
  
  // Settings
  const [popSize, setPopSize] = useState(50);
  const [mutationRate, setMutationRate] = useState(0.1);
  const [cityCount, setCityCount] = useState(12);

  const requestRef = useRef<number>(undefined);

  const initCities = useCallback(() => {
    const newCities: City[] = [];
    for (let i = 0; i < cityCount; i++) {
      newCities.push({
        id: i,
        x: 50 + Math.random() * (700),
        y: 50 + Math.random() * (400)
      });
    }
    setCities(newCities);
    const initialPop = generateInitialPopulation(popSize, newCities);
    setPopulation(initialPop);
    setGeneration(0);
    setBestDistance(Math.min(...initialPop.map(p => p.distance)));
    setIsRunning(false);
  }, [cityCount, popSize]);

  useEffect(() => {
    initCities();
  }, [initCities]);

  const evolve = useCallback(() => {
    if (!isRunning) return;

    setPopulation(prevPop => {
      const newPop: Individual[] = [];
      const sorted = [...prevPop].sort((a, b) => b.fitness - a.fitness);
      
      // Elitism: keep best
      newPop.push(sorted[0]);

      while (newPop.length < popSize) {
        const parent1 = tournamentSelection(prevPop);
        const parent2 = tournamentSelection(prevPop);
        
        let childPath = orderCrossover(parent1, parent2);
        childPath = mutate(childPath, mutationRate);
        
        const dist = calculatePathDistance(childPath, cities);
        newPop.push({
          path: childPath,
          distance: dist,
          fitness: 1 / dist
        });
      }

      const bestOfNew = Math.min(...newPop.map(p => p.distance));
      setBestDistance(bestOfNew);
      return newPop;
    });

    setGeneration(g => g + 1);
  }, [isRunning, cities, popSize, mutationRate]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(evolve, 50);
      return () => clearInterval(interval);
    }
  }, [isRunning, evolve]);

  const bestPath = population.length > 0 
    ? [...population].sort((a, b) => b.fitness - a.fitness)[0].path 
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-0 border border-accent overflow-hidden bg-canvas">
      {/* Controls */}
      <div className="lg:w-80 flex flex-col gap-6 bg-secondary p-8 border-b lg:border-b-0 lg:border-r border-accent">
        <div className="flex items-center gap-2 text-accent font-bold mb-2">
          <Settings className="w-4 h-4 opacity-50" />
          <h2 className="uppercase tracking-[0.2em] text-[10px]">Параметры ГА</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Города: {cityCount}</label>
            </div>
            <input 
              type="range" min="5" max="30" step="1" 
              value={cityCount} 
              onChange={(e) => setCityCount(parseInt(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Популяция: {popSize}</label>
            <input 
              type="range" min="10" max="200" step="10" 
              value={popSize} 
              onChange={(e) => setPopSize(parseInt(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Мутация: {(mutationRate * 100).toFixed(0)}%</label>
            <input 
              type="range" min="0" max="0.5" step="0.01" 
              value={mutationRate} 
              onChange={(e) => setMutationRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-6 border-2 transition-all active:scale-95 text-xs font-bold uppercase tracking-widest",
              isRunning 
                ? "bg-canvas border-accent text-accent hover:bg-secondary" 
                : "bg-accent border-accent text-canvas hover:opacity-90"
            )}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isRunning ? "Пауза" : "Запустить"}
          </button>
          <button 
            onClick={initCities}
            className="flex items-center justify-center gap-2 py-3 border border-accent/20 text-accent/60 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Сброс
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-accent/10 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[10px] font-bold uppercase opacity-40">Поколение</span>
            <span className="font-mono text-sm">#{generation}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase opacity-40">Дистанция</span>
            <span className="font-mono text-lg font-bold text-accent">{bestDistance?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 bg-canvas relative overflow-hidden h-[550px]">
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 border border-accent/20 bg-canvas/50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          Пространство поиска TSP
        </div>

        <svg width="100%" height="100%" viewBox="0 0 800 500" className="w-full h-full">
          {/* Paths */}
          {bestPath.length > 0 && (
            <motion.path
              layout
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              d={bestPath.map((cityId, index) => {
                const city = cities.find(c => c.id === cityId)!;
                return `${index === 0 ? 'M' : 'L'} ${city.x} ${city.y}`;
              }).join(' ') + ' Z'}
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="1.5"
              strokeLinejoin="miter"
              strokeDasharray="4 4"
              className="opacity-60"
            />
          )}

          {/* Cities */}
          <AnimatePresence>
            {cities.map((city) => (
              <motion.g
                key={city.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <rect
                  x={city.x - 4}
                  y={city.y - 4}
                  width="8"
                  height="8"
                  className="fill-accent stroke-canvas stroke-1"
                />
                <text
                  x={city.x + 8}
                  y={city.y + 4}
                  className="fill-accent/40 text-[9px] font-mono font-bold pointer-events-none uppercase"
                >
                  N{city.id}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
};
