import { NodeType } from './type';

export function dfs(grid: NodeType[][], start: number[], end: number[]): number[][] {
  const stack: number[][] = [start];
  const visited = new Set<string>();
  const parent = new Map<string, number[]>();
  const path: number[][] = [];

  visited.add(`${start[0]},${start[1]}`);

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    
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
        stack.push([newRow, newCol]);
      }
    }
  }

  return [];
}
  