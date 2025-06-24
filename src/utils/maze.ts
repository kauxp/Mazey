import { NodeType } from './type';

const getUnvisitedNeighbors = (grid: NodeType[][], row: number, col: number): [number, number][] => {
  const neighbors: [number, number][] = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // 1 step in each direction
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (
      newRow >= 0 && newRow < grid.length &&
      newCol >= 0 && newCol < grid[0].length &&
      grid[newRow][newCol].isWall &&
      !grid[newRow][newCol].isVisited
    ) {
      neighbors.push([newRow, newCol]);
    }
  }
  
  return neighbors;
};

const generateMazeRecursive = (grid: NodeType[][], row: number, col: number): void => {
  grid[row][col].isVisited = true;
  grid[row][col].isWall = false; 
  
  const neighbors = getUnvisitedNeighbors(grid, row, col);
  // Shuffle neighbors for randomness
  for (let i = neighbors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
  }
  
  for (const [nextRow, nextCol] of neighbors) {
    if (!grid[nextRow][nextCol].isVisited) {
      generateMazeRecursive(grid, nextRow, nextCol);
    }
  }
};

export function randomMaze(grid: NodeType[][], startNode: NodeType, finishNode: NodeType): number[][] {
    if (!startNode || !finishNode || startNode === finishNode) return [];

    let walls: number[][] = [];

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            if ((row === startNode.row && col === startNode.col) ||
                (row === finishNode.row && col === finishNode.col)) {
                continue;
            }

            if (Math.random() < 0.33) {
                walls.push([row, col]);
            }

        }
    }

    walls.sort(() => Math.random() - 0.5);

    return walls;
}

