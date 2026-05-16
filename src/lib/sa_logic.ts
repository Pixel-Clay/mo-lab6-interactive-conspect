import { City } from '../types';

export function getNeighborPath(path: number[]): number[] {
  const newPath = [...path];
  const i = Math.floor(Math.random() * newPath.length);
  const j = Math.floor(Math.random() * newPath.length);
  [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
  return newPath;
}

export function saTransitionProbability(energyDelta: number, temperature: number): number {
  if (energyDelta < 0) return 1.0;
  return Math.exp(-energyDelta / temperature);
}
