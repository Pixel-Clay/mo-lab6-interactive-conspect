export interface City {
  id: number;
  x: number;
  y: number;
}

export interface Individual {
  path: number[];
  distance: number;
  fitness: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
  pheromone: number;
}

export interface Ant {
  currentPath: string[];
  totalDistance: number;
  hasReachedGoal: boolean;
}
