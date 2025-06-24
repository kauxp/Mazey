import { NodeType } from './type';

export function bfs(grid: NodeType[][], start: number[], end: number[]): number[][] {
  const queue: number[][] = [start];
  const visited = new Set<string>();
  const parent = new Map<string, number[]>();
  const path: number[][] = [];

  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    
    if (row === end[0] && col === end[1]) {
      let current: number[] | undefined = [row, col];
      while (current) {
        path.unshift(current);
        current = parent.get(`${current[0]},${current[1]}`);
      }
      return path;
    }

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const key = `${newRow},${newCol}`;
      
      if (
        newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[0].length &&
        !visited.has(key) &&
        !grid[newRow][newCol].isWall
      ) {
        visited.add(key);
        parent.set(key, [row, col]);
        queue.push([newRow, newCol]);
      }
    }
  }

  return [];
}

export function bfsVisitedNodes(grid: NodeType[][], start: number[], end: number[]): number[][] {
  const queue: number[][] = [start];
  const visited = new Set<string>();
  const visitedInOrder: number[][] = [];
  const parent = new Map<string, number[]>();

  visited.add(`${start[0]},${start[1]}`);
  visitedInOrder.push(start);

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    
    if (row === end[0] && col === end[1]) {
      break;
    }

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const key = `${newRow},${newCol}`;
      
      if (
        newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[0].length &&
        !visited.has(key) &&
        !grid[newRow][newCol].isWall
      ) {
        visited.add(key);
        parent.set(key, [row, col]);
        queue.push([newRow, newCol]);
        visitedInOrder.push([newRow, newCol]);
      }
    }
  }

  return visitedInOrder;
}

export function getShortestPath(visitedNodes: number[][], end: number[]): number[][] {
  const path: number[][] = [];
  let current = end;
  
  const endIndex = visitedNodes.findIndex(node => node[0] === end[0] && node[1] === end[1]);
  
  if (endIndex === -1) return []; 
  
  for (let i = endIndex; i >= 0; i--) {
    path.unshift(visitedNodes[i]);
  }
  
  return path;
}
