import { City, Individual, Edge, Node, Ant } from '../types';

// --- Genetic Algorithm for TSP ---

export function calculatePathDistance(path: number[], cities: City[]): number {
  let distance = 0;
  for (let i = 0; i < path.length; i++) {
    const cityA = cities.find(c => c.id === path[i])!;
    const cityB = cities.find(c => c.id === path[(i + 1) % path.length])!;
    distance += Math.sqrt(Math.pow(cityA.x - cityB.x, 2) + Math.pow(cityA.y - cityB.y, 2));
  }
  return distance;
}

export function generateInitialPopulation(size: number, cities: City[]): Individual[] {
  const ids = cities.map(c => c.id);
  const population: Individual[] = [];

  for (let i = 0; i < size; i++) {
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    const dist = calculatePathDistance(shuffled, cities);
    population.push({
      path: shuffled,
      distance: dist,
      fitness: 1 / dist
    });
  }
  return population;
}

export function tournamentSelection(population: Individual[], k: number = 3): Individual {
  let best: Individual | null = null;
  for (let i = 0; i < k; i++) {
    const randomInd = population[Math.floor(Math.random() * population.length)];
    if (!best || randomInd.fitness > best.fitness) {
      best = randomInd;
    }
  }
  return best!;
}

export function orderCrossover(parent1: Individual, parent2: Individual): number[] {
  const size = parent1.path.length;
  const child = new Array(size).fill(-1);
  
  const start = Math.floor(Math.random() * size);
  const end = Math.floor(Math.random() * (size - start)) + start;

  // Copy segment from first parent
  for (let i = start; i <= end; i++) {
    child[i] = parent1.path[i];
  }

  // Fill remaining from second parent
  let childIdx = (end + 1) % size;
  let parent2Idx = (end + 1) % size;

  while (child.includes(-1)) {
    const gene = parent2.path[parent2Idx];
    if (!child.includes(gene)) {
      child[childIdx] = gene;
      childIdx = (childIdx + 1) % size;
    }
    parent2Idx = (parent2Idx + 1) % size;
  }

  return child;
}

export function mutate(path: number[], rate: number): number[] {
  const newPath = [...path];
  if (Math.random() < rate) {
    const i = Math.floor(Math.random() * newPath.length);
    const j = Math.floor(Math.random() * newPath.length);
    [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
  }
  return newPath;
}

// --- Ant Colony Optimization for Shortest Path ---

export function selectNextNode(
  currentNode: string,
  targetNode: string,
  edges: Edge[],
  alpha: number,
  beta: number,
  visited: Set<string>
): string | null {
  const availableEdges = edges.filter(e => e.source === currentNode && !visited.has(e.target));
  
  if (availableEdges.length === 0) return null;

  const weights = availableEdges.map(edge => {
    const pheromone = Math.pow(edge.pheromone, alpha);
    const heuristic = Math.pow(1 / edge.weight, beta);
    return pheromone * heuristic;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < availableEdges.length; i++) {
    random -= weights[i];
    if (random <= 0) return availableEdges[i].target;
  }

  return availableEdges[availableEdges.length - 1].target;
}

export function updatePheromones(
  edges: Edge[],
  ants: Ant[],
  evaporationRate: number,
  Q: number,
  minPheromone: number = 0.1
): Edge[] {
  return edges.map(edge => {
    // Evaporation
    let newPheromone = edge.pheromone * (1 - evaporationRate);

    // Deposit
    ants.forEach(ant => {
      if (ant.hasReachedGoal) {
        // Find if this edge was used in the path
        for (let i = 0; i < ant.currentPath.length - 1; i++) {
          if (ant.currentPath[i] === edge.source && ant.currentPath[i + 1] === edge.target) {
            newPheromone += Q / ant.totalDistance;
          }
        }
      }
    });

    return { ...edge, pheromone: Math.max(newPheromone, minPheromone) };
  });
}
