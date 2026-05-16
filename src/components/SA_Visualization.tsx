import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Thermometer, Zap, Activity } from 'lucide-react';
import { City } from '../types';
import { calculatePathDistance } from '../lib/algorithms';
import { getNeighborPath, saTransitionProbability } from '../lib/sa_logic';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const SA_Visualization: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [bestPath, setBestPath] = useState<number[]>([]);
  const [temp, setTemp] = useState(1.0);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Settings
  const [initialTemp, setInitialTemp] = useState(100);
  const [coolingRate, setCoolingRate] = useState(0.995);
  const [cityCount, setCityCount] = useState(15);

  const init = useCallback(() => {
    const newCities: City[] = [];
    for (let i = 0; i < cityCount; i++) {
      newCities.push({
        id: i,
        x: 50 + Math.random() * 700,
        y: 50 + Math.random() * 400
      });
    }
    const path = newCities.map(c => c.id).sort(() => Math.random() - 0.5);
    setCities(newCities);
    setCurrentPath(path);
    setBestPath(path);
    setTemp(initialTemp);
    setIteration(0);
    setIsRunning(false);
  }, [cityCount, initialTemp]);

  useEffect(() => { init(); }, [init]);

  const step = useCallback(() => {
    if (!isRunning || temp < 0.01) {
      if (temp < 0.01) setIsRunning(false);
      return;
    }

    const nextPath = getNeighborPath(currentPath);
    const currentDist = calculatePathDistance(currentPath, cities);
    const nextDist = calculatePathDistance(nextPath, cities);
    
    const delta = nextDist - currentDist;
    const prob = saTransitionProbability(delta, temp);

    if (Math.random() < prob) {
      setCurrentPath(nextPath);
      if (nextDist < calculatePathDistance(bestPath, cities)) {
        setBestPath(nextPath);
      }
    }

    setTemp(t => t * coolingRate);
    setIteration(i => i + 1);
  }, [isRunning, temp, currentPath, cities, bestPath, coolingRate]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(step, 10);
      return () => clearInterval(interval);
    }
  }, [isRunning, step]);

  return (
    <div className="flex flex-col lg:flex-row gap-0 border border-accent overflow-hidden bg-canvas">
      <div className="lg:w-80 flex flex-col gap-6 bg-secondary p-8 border-b lg:border-b-0 lg:border-r border-accent">
        <div className="flex items-center gap-2 text-accent font-bold mb-2">
          <Thermometer className="w-4 h-4 opacity-50" />
          <h2 className="uppercase tracking-[0.2em] text-[10px]">Параметры отжига</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Т-нач: {initialTemp}</label>
            <input 
              type="range" min="10" max="500" step="10" 
              value={initialTemp} 
              onChange={(e) => setInitialTemp(parseInt(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Коэфф. охлажд: {coolingRate}</label>
            <input 
              type="range" min="0.8" max="0.999" step="0.001" 
              value={coolingRate} 
              onChange={(e) => setCoolingRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-6 border-2 transition-all active:scale-95 text-xs font-bold uppercase tracking-widest",
              isRunning ? "bg-canvas border-accent text-accent" : "bg-accent border-accent text-canvas"
            )}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isRunning ? "Пауза" : "Запустить"}
          </button>
          <button onClick={init} className="flex items-center justify-center gap-2 py-3 border border-accent/20 text-accent/60 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent">
            <RotateCcw className="w-4 h-4" />
            Сброс
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-accent/10 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[10px] font-bold uppercase opacity-40">Температура</span>
            <span className="font-mono text-sm">{temp.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase opacity-40">Лучшая дистанция</span>
            <span className="font-mono text-lg font-bold text-accent">{calculatePathDistance(bestPath, cities).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-canvas relative overflow-hidden h-[550px]">
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 border border-accent/20 bg-canvas/50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
          <Activity className="w-3 h-3 text-accent opacity-50" />
          Физическая аналогия (отжиг)
        </div>

        <svg width="100%" height="100%" viewBox="0 0 800 500">
          <path
            d={bestPath.map((id, i) => {
              const c = cities.find(city => city.id === id)!;
              return `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`;
            }).join(' ') + ' Z'}
            fill="none" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="3 3" className="opacity-30"
          />
          <path
            d={currentPath.map((id, i) => {
              const c = cities.find(city => city.id === id)!;
              return `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`;
            }).join(' ') + ' Z'}
            fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="miter"
          />
          {cities.map(c => (
            <rect key={c.id} x={c.x-3} y={c.y-3} width="6" height="6" className="fill-accent" />
          ))}
        </svg>
      </div>
    </div>
  );
};
