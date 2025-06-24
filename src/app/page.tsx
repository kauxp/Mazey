'use client';

import { useState, useEffect } from 'react';
import { MazeSolver } from '../components/mazeSolver';
import { Navbar } from '../components/navBar';
import { createInitialGrid } from '../utils/gridUtils';
import { NodeType } from '../utils/type';
import { randomMaze } from '../utils/maze';
import { bfs } from '../utils/bfs';
import { dfs } from '../utils/dfs';

export default function Home() {
  const rows = 12;
  const cols = 25;
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [path, setPath] = useState<number[][]>([]);
  const [mazeSpeed] = useState(20);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('BFS');
  const [executionTime, setExecutionTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('hello-kitty');

  // Theme style maps for page and navbar
  const themeStyles: Record<string, { bg: string; navbar: string; orb1: string; orb2: string; orb3: string; }> = {
    'hello-kitty': {
      bg: 'bg-gradient-to-br from-white via-pink-50 to-white',
      navbar: 'bg-white border-b-4 border-pink-200 shadow-md',
      orb1: 'bg-pink-100', orb2: 'bg-pink-200', orb3: 'bg-gray-100',
    },
    'barbie': {
      bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50',
      navbar: 'bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 border-b-4 border-pink-300 shadow-2xl',
      orb1: 'bg-pink-300/30', orb2: 'bg-purple-300/30', orb3: 'bg-pink-200/30',
    },
    'batman': {
      bg: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
      navbar: 'bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-4 border-yellow-500 shadow-2xl',
      orb1: 'bg-yellow-500/10', orb2: 'bg-red-600/10', orb3: 'bg-blue-600/10',
    },
    'default': {
      bg: 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50',
      navbar: 'bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 border-b-4 border-blue-200 shadow',
      orb1: 'bg-blue-400/20', orb2: 'bg-purple-400/20', orb3: 'bg-green-400/10',
    },
  };
  const t = themeStyles[theme] || themeStyles['default'];

  // Ensure we're on the client side and initialize grid
  useEffect(() => {
    setIsClient(true);
    setGrid(createInitialGrid(rows, cols, 0, 0, rows - 1, cols - 1));
  }, [rows, cols]);

  // Generate a new random maze with animation
  const handleGenerateMaze = () => {
    if (visualizingAlgorithm || generatingMaze || grid.length === 0) return;
    
    setGeneratingMaze(true);
    setPath([]);
    setExecutionTime(0);
    
    try {
      // Create a fresh grid
      const newGrid = createInitialGrid(rows, cols, 0, 0, rows - 1, cols - 1);
      setGrid(newGrid);
      
      // Get start and finish nodes
      const startNode = newGrid[0][0];
      const finishNode = newGrid[rows - 1][cols - 1];
      
      // Generate maze with validation
      const generateValidMaze = () => {
        const walls = randomMaze(newGrid, startNode, finishNode);
        
        // Apply walls to the grid
        const testGrid = newGrid.map(row => [...row]);
        walls.forEach(wall => {
          testGrid[wall[0]][wall[1]] = { ...testGrid[wall[0]][wall[1]], isWall: true };
        });
        
        // Check if there's a path from start to finish
        const start = [0, 0];
        const end = [rows - 1, cols - 1];
        const pathExists = bfs(testGrid, start, end).length > 0;
        
        if (pathExists) {
          // Valid maze found, animate it
          console.log('Valid maze generated with', walls.length, 'walls');
          
          // Animate each wall one by one
          walls.forEach((wall, idx) => {
            setTimeout(() => {
              setGrid(prevGrid => {
                const updatedGrid = prevGrid.map(row => [...row]);
                updatedGrid[wall[0]][wall[1]] = { ...updatedGrid[wall[0]][wall[1]], isWall: true };
                return updatedGrid;
              });
              
              // Done animating
              if (idx === walls.length - 1) {
                setGeneratingMaze(false);
              }
            }, idx * mazeSpeed);
          });
          
          // If no walls to animate, finish immediately
          if (walls.length === 0) {
            setGeneratingMaze(false);
          }
        } else {
          // No path found, regenerate
          console.log('No path found, regenerating maze...');
          setTimeout(generateValidMaze, 10);
        }
      };
      
      // Start generating valid maze
      generateValidMaze();
      
    } catch (error) {
      console.error('Error generating maze:', error);
      setGeneratingMaze(false);
    }
  };

  // Visualize BFS algorithm using the existing BFS implementation
  const visualizeBFS = () => {
    if (visualizingAlgorithm || generatingMaze || grid.length === 0) return;

    setVisualizingAlgorithm(true);
    setPath([]);

    // Reset grid visited states
    const resetGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isShortest: false
      }))
    );
    setGrid(resetGrid);

    setTimeout(() => {
      const start = [0, 0];
      const end = [rows - 1, cols - 1];

      // Measure BFS execution time
      const startTime = typeof window !== 'undefined' ? performance.now() : 0;
      const shortestPath = bfs(resetGrid, start, end);
      const endTime = typeof window !== 'undefined' ? performance.now() : 0;
      const executionTime = endTime - startTime;
      
      setExecutionTime(executionTime);
      
      if (shortestPath.length > 0) {
        // Animate the path
        animatePath(shortestPath);
      } else {
        // No path found
        setVisualizingAlgorithm(false);
        alert('No path found from start to finish!');
      }
    }, 100);
  };

  // Visualize DFS algorithm using the existing DFS implementation
  const visualizeDFS = () => {
    if (visualizingAlgorithm || generatingMaze || grid.length === 0) return;

    setVisualizingAlgorithm(true);
    setPath([]);

    // Reset grid visited states
    const resetGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isShortest: false
      }))
    );
    setGrid(resetGrid);

    setTimeout(() => {
      const start = [0, 0];
      const end = [rows - 1, cols - 1];

      // Measure DFS execution time
      const startTime = typeof window !== 'undefined' ? performance.now() : 0;
      const shortestPath = dfs(resetGrid, start, end);
      const endTime = typeof window !== 'undefined' ? performance.now() : 0;
      const executionTime = endTime - startTime;
      
      setExecutionTime(executionTime);
      
      if (shortestPath.length > 0) {
        // Animate the path
        animatePath(shortestPath);
      } else {
        // No path found
        setVisualizingAlgorithm(false);
        alert('No path found from start to finish!');
      }
    }, 100);
  };

  // Animate the path step by step
  const animatePath = (path: number[][]) => {
    path.forEach((node, idx) => {
      setTimeout(() => {
        setGrid(prevGrid => {
          const updatedGrid = prevGrid.map(row => [...row]);
          updatedGrid[node[0]][node[1]] = { 
            ...updatedGrid[node[0]][node[1]], 
            isShortest: true 
          };
          return updatedGrid;
        });
        
        if (idx === path.length - 1) {
          setVisualizingAlgorithm(false);
          setPath(path);
        }
      }, idx * 50);
    });
  };

  const animateMaze = (walls: NodeType[]) => {
    const newGrid = grid.map(row =>
      row.map(node => {
        const wallMatch = walls.find(w => w.row === node.row && w.col === node.col);
        return wallMatch ? { ...node, isWall: true } : node;
      })
    );
    setGrid(newGrid);
  };

  const clearPath = () => {
    setPath([]);
    setExecutionTime(0);
    // Reset visited and shortest path states
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isShortest: false
      }))
    );
    setGrid(newGrid);
  };

  return (
    <div className={`min-h-screen ${t.bg}`}>
      <Navbar
        generatingMaze={generatingMaze}
        visualizingAlgorithm={visualizingAlgorithm}
        onGenerateMaze={handleGenerateMaze}
        onBFS={visualizeBFS}
        onDFS={visualizeDFS}
        onClear={clearPath}
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        executionTime={executionTime}
        theme={theme}
        setTheme={setTheme}
        navbarClass={t.navbar}
      />
      
      <div className="relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-3xl ${t.orb1}`}></div>
          <div className={`absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-3xl ${t.orb2}`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-3xl ${t.orb3}`}></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center">
                <MazeSolver
                  mazeSpeed={mazeSpeed}
                  visualizingAlgorithm={visualizingAlgorithm}
                  generatingMaze={generatingMaze}
                  setGeneratingMaze={setGeneratingMaze}
                  grid={grid}
                  setGrid={setGrid}
                  animateMaze={animateMaze}
                  path={path}
                  theme={theme}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
