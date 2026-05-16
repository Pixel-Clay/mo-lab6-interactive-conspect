import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, Bug, Activity, Layers } from 'lucide-react';
import { Node, Edge, Ant } from '../types';
import { selectNextNode, updatePheromones } from '../lib/algorithms';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const ACO_Visualization: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [ants, setAnts] = useState<Ant[]>([]);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [bestPath, setBestPath] = useState<{ path: string[], distance: number } | null>(null);

  // Settings
  const [alpha, setAlpha] = useState(1); // Pheromone weight
  const [beta, setBeta] = useState(2);  // Heuristic weight
  const [evaporation, setEvaporation] = useState(0.1);
  const [antCount, setAntCount] = useState(10);
  const [Q, setQ] = useState(100);

  const startNodeId = 'A';
  const targetNodeId = 'G';

  const initGraph = useCallback(() => {
    const defaultNodes: Node[] = [
      { id: 'A', x: 50, y: 250 },
      { id: 'B', x: 200, y: 100 },
      { id: 'C', x: 200, y: 400 },
      { id: 'D', x: 400, y: 100 },
      { id: 'E', x: 400, y: 400 },
      { id: 'F', x: 600, y: 250 },
      { id: 'G', x: 750, y: 250 },
    ];

    const defaultEdges: Edge[] = [
      { source: 'A', target: 'B', weight: 150, pheromone: 1 },
      { source: 'A', target: 'C', weight: 150, pheromone: 1 },
      { source: 'B', target: 'D', weight: 200, pheromone: 1 },
      { source: 'B', target: 'F', weight: 400, pheromone: 1 },
      { source: 'C', target: 'E', weight: 200, pheromone: 1 },
      { source: 'C', target: 'F', weight: 400, pheromone: 1 },
      { source: 'D', target: 'F', weight: 200, pheromone: 1 },
      { source: 'D', target: 'G', weight: 400, pheromone: 1 },
      { source: 'E', target: 'F', weight: 200, pheromone: 1 },
      { source: 'E', target: 'G', weight: 400, pheromone: 1 },
      { source: 'F', target: 'G', weight: 150, pheromone: 1 },
    ];

    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setIteration(0);
    setBestPath(null);
    setAnts([]);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  const runIteration = useCallback(() => {
    const newAnts: Ant[] = [];
    
    for (let i = 0; i < antCount; i++) {
      let current = startNodeId;
      const path = [current];
      const visited = new Set([current]);
      let dist = 0;
      let reached = false;

      while (true) {
        const next = selectNextNode(current, targetNodeId, edges, alpha, beta, visited);
        if (!next) break;

        const edge = edges.find(e => e.source === current && e.target === next)!;
        dist += edge.weight;
        path.push(next);
        visited.add(next);
        current = next;

        if (next === targetNodeId) {
          reached = true;
          break;
        }
      }

      newAnts.push({
        currentPath: path,
        totalDistance: dist,
        hasReachedGoal: reached
      });

      if (reached && (!bestPath || dist < bestPath.distance)) {
        setBestPath({ path, distance: dist });
      }
    }

    setAnts(newAnts);
    setEdges(prevEdges => updatePheromones(prevEdges, newAnts, evaporation, Q));
    setIteration(i => i + 1);
  }, [edges, antCount, alpha, beta, evaporation, Q, bestPath]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(runIteration, 300);
      return () => clearInterval(interval);
    }
  }, [isRunning, runIteration]);

  return (
    <div className="flex flex-col lg:flex-row gap-0 border border-accent overflow-hidden bg-canvas">
      {/* Controls */}
      <div className="lg:w-80 flex flex-col gap-6 bg-secondary p-8 border-b lg:border-b-0 lg:border-r border-accent">
        <div className="flex items-center gap-2 text-accent font-bold mb-2">
          <Bug className="w-4 h-4 opacity-50" />
          <h2 className="uppercase tracking-[0.2em] text-[10px]">Динамика ACO</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Вес опыта (α): {alpha}</label>
            <input 
              type="range" min="0" max="5" step="0.5" 
              value={alpha} 
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Вес жадности (β): {beta}</label>
            <input 
              type="range" min="0" max="5" step="0.5" 
              value={beta} 
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full h-1 bg-accent/10 appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-accent uppercase tracking-wider opacity-60">Испарение: {(evaporation * 100).toFixed(0)}%</label>
            <input 
              type="range" min="0" max="0.5" step="0.05" 
              value={evaporation} 
              onChange={(e) => setEvaporation(parseFloat(e.target.value))}
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
            onClick={initGraph}
            className="flex items-center justify-center gap-2 py-3 border border-accent/20 text-accent/60 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Сброс
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-accent/10 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[10px] font-bold uppercase opacity-40">Итерация</span>
            <span className="font-mono text-sm">#{iteration}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase opacity-40">Мин. маршрут</span>
            <span className="font-mono text-lg font-bold text-accent">{bestPath?.distance || '-'}</span>
          </div>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 bg-canvas relative overflow-hidden h-[550px]">
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 border border-accent/20 bg-canvas/50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
          <Activity className="w-3 h-3 text-accent opacity-50" />
          Ориентированный граф A → G
        </div>

        <svg width="100%" height="100%" viewBox="0 0 800 500" className="w-full h-full">
          <defs>
            <marker id="arrow-geometric" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#1A1A1A" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const start = nodes.find(n => n.id === edge.source)!;
            const end = nodes.find(n => n.id === edge.target)!;
            const pheromoneIntensity = Math.min(edge.pheromone / 5, 1);
            
            return (
              <g key={`${edge.source}-${edge.target}`}>
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="#1A1A1A"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  markerEnd="url(#arrow-geometric)"
                  className="opacity-20"
                />
                <motion.line
                  initial={false}
                  animate={{ strokeWidth: 0.5 + pheromoneIntensity * 6 }}
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="#1A1A1A"
                  strokeLinecap="square"
                  className="opacity-80"
                />
                <text 
                  x={(start.x + end.x) / 2} 
                  y={(start.y + end.y) / 2 - 8}
                  className="fill-accent/30 text-[8px] font-mono select-none"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Ants */}
          <AnimatePresence>
            {ants.map((ant, antIdx) => (
              <motion.g key={`ant-${antIdx}-${iteration}`}>
                {ant.currentPath.map((nodeId, nodeIdx) => {
                  if (nodeIdx === 0) return null;
                  const prev = nodes.find(n => n.id === ant.currentPath[nodeIdx - 1])!;
                  const curr = nodes.find(n => n.id === nodeId)!;
                  
                  return (
                    <motion.rect
                      key={`step-${nodeIdx}`}
                      initial={{ cx: prev.x, cy: prev.y, opacity: 0 }}
                      animate={{ cx: curr.x, cy: curr.y, opacity: 1 }}
                      transition={{ 
                        delay: nodeIdx * 0.1, 
                        duration: 0.2,
                        ease: "linear"
                      }}
                      width="4"
                      height="4"
                      x={curr.x - 2}
                      y={curr.y - 2}
                      className="fill-accent"
                    />
                  );
                })}
              </motion.g>
            ))}
          </AnimatePresence>

          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <rect
                x={node.x - 14}
                y={node.y - 14}
                width="28"
                height="28"
                className={cn(
                  "fill-canvas stroke-[1px]",
                  node.id === startNodeId || node.id === targetNodeId ? "stroke-accent" : "stroke-accent/20"
                )}
              />
              <text
                x={node.x}
                y={node.y}
                dy=".35em"
                textAnchor="middle"
                className="font-bold text-[10px] fill-accent select-none font-mono"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-6 right-6 text-[8px] text-accent/40 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-8 h-[2px] bg-accent/40"></div>
          Плотность феромонов
        </div>
      </div>
    </div>
  );
};
