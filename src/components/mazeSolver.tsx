'use client';
import React from 'react';
import { randomMaze } from '../utils/maze';
import {
  getStartNode,
  getFinishNode,
} from '../utils/gridUtils';
import {NodeType} from '../utils/type'

interface MazeSolverProps {
  mazeSpeed: number;
  visualizingAlgorithm: boolean;
  generatingMaze: boolean;
  setGeneratingMaze: (val: boolean) => void;
  grid: NodeType[][];
  setGrid: React.Dispatch<React.SetStateAction<NodeType[][]>>;
  animateMaze: (walls: NodeType[]) => void;
  path: number[][];
  theme: string;
}

export const MazeSolver: React.FC<MazeSolverProps> = ({
  mazeSpeed,
  visualizingAlgorithm,
  generatingMaze,
  setGeneratingMaze,
  grid,
  setGrid,
  animateMaze,
  path,
  theme,
}) => {
  // Theme style maps
  const themeStyles: Record<string, any> = {
    'hello-kitty': {
      start:   'bg-gradient-to-br from-pink-200 to-white text-pink-600 shadow-lg border-2 border-pink-300',
      finish:  'bg-gradient-to-br from-pink-100 to-purple-100 text-pink-700 shadow-lg border-2 border-pink-200',
      wall:    'bg-gradient-to-br from-pink-500 to-pink-700 text-white shadow-inner border-2 border-pink-700',
      path:    'bg-gradient-to-br from-pink-300 to-pink-400 text-white shadow-lg border-2 border-pink-200',
      visited: 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-400 shadow border border-blue-100',
      empty:   'bg-gradient-to-br from-white to-pink-50 text-gray-400 shadow hover:shadow-lg border border-pink-100',
      startEmoji: '🎀', finishEmoji: '🏠',
      statusBg: 'bg-gradient-to-r from-pink-200 to-pink-400 text-pink-700 border-2 border-pink-200',
      loadingBg: 'bg-gradient-to-br from-white to-pink-100 border-2 border-pink-200',
      loadingIcon: '🎀',
      loadingTitle: 'Hello Kitty Maze',
      loadingText: 'Preparing your cute adventure!',
    },
    'barbie': {
      start:   'bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-xl animate-pulse border-2 border-pink-300',
      finish:  'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-xl animate-pulse border-2 border-purple-300',
      wall:    'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-600 shadow-inner border border-gray-400',
      path:    'bg-gradient-to-br from-yellow-300 to-pink-400 text-white shadow-xl border-2 border-yellow-200',
      visited: 'bg-gradient-to-br from-cyan-300 to-blue-400 text-white shadow-lg border border-cyan-200',
      empty:   'bg-gradient-to-br from-pink-50 to-purple-50 text-pink-600 shadow-md hover:shadow-xl border border-pink-200',
      startEmoji: '👑', finishEmoji: '💎',
      statusBg: 'bg-gradient-to-r from-pink-400 to-purple-500 text-white border-2 border-pink-300',
      loadingBg: 'bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-pink-300',
      loadingIcon: '👑',
      loadingTitle: '✨ Barbie World...',
      loadingText: 'Preparing your magical adventure!',
    },
    'batman': {
      start:   'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black shadow-xl border-2 border-yellow-400',
      finish:  'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-xl border-2 border-red-500',
      wall:    'bg-gradient-to-br from-black to-gray-900 text-yellow-400 shadow-inner border-2 border-yellow-400',
      path:    'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl border-2 border-blue-400',
      visited: 'bg-gradient-to-br from-gray-600 to-gray-800 text-white shadow-lg border border-gray-500',
      empty:   'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 shadow-md hover:shadow-xl border border-gray-700',
      startEmoji: '🦇', finishEmoji: '⚡',
      statusBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-2 border-yellow-400',
      loadingBg: 'bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500',
      loadingIcon: '🦇',
      loadingTitle: '🦇 Gotham City...',
      loadingText: 'Preparing your Batman adventure!',
    },
    'default': {
      start:   'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg border-2 border-blue-300',
      finish:  'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg border-2 border-green-300',
      wall:    'bg-gradient-to-br from-gray-400 to-gray-600 text-gray-200 shadow-inner border border-gray-400',
      path:    'bg-gradient-to-br from-yellow-300 to-green-400 text-white shadow-lg border-2 border-yellow-200',
      visited: 'bg-gradient-to-br from-blue-100 to-green-100 text-blue-400 shadow border border-blue-100',
      empty:   'bg-gradient-to-br from-white to-gray-50 text-gray-500 shadow hover:shadow-lg border border-gray-100',
      startEmoji: '🚩', finishEmoji: '🏁',
      statusBg: 'bg-gradient-to-r from-blue-200 to-green-200 text-blue-700 border-2 border-blue-200',
      loadingBg: 'bg-gradient-to-br from-white to-gray-100 border-2 border-blue-200',
      loadingIcon: '🚩',
      loadingTitle: 'Maze Solver',
      loadingText: 'Preparing your adventure!',
    },
  };
  const t: any = themeStyles[theme] || themeStyles['default'];

  const getNodeClass = (node: NodeType) => {
    const baseClass = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 transform hover:scale-105 cursor-pointer";
    if (node.isStart) return `${baseClass} ${t.start}`;
    if (node.isFinish) return `${baseClass} ${t.finish}`;
    if (node.isWall) return `${baseClass} ${t.wall}`;
    if (node.isShortest) return `${baseClass} ${t.path}`;
    if (node.isVisited) return `${baseClass} ${t.visited}`;
    return `${baseClass} ${t.empty}`;
  };

  const getNodeContent = (node: NodeType) => {
    if (node.isStart) return t.startEmoji;
    if (node.isFinish) return t.finishEmoji;
    return '';
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6">
      {/* Grid Container with Themed Styling */}
      {grid.length > 0 ? (
        <div className="relative">
          {/* Main Grid */}
          <div className={`relative border-4 sm:border-6 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden max-w-full p-2 sm:p-4 ${t.loadingBg}`}>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((node, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getNodeClass(node)}
                    title={`Row: ${rowIndex}, Col: ${colIndex}${node.isStart ? ' (Start)' : ''}${node.isFinish ? ' (Finish)' : ''}${node.isWall ? ' (Wall)' : ''}${node.isVisited ? ' (Visited)' : ''}${node.isShortest ? ' (Path)' : ''}`}
                  >
                    {getNodeContent(node)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Status Indicator */}
          {(generatingMaze || visualizingAlgorithm) && (
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <div className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg ${t.statusBg}`}>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${generatingMaze ? 'animate-pulse' : 'animate-pulse'} ${generatingMaze ? 'bg-pink-300' : 'bg-blue-300'}`}></div>
                  <span className="text-sm sm:text-base font-bold">
                    {generatingMaze ? `${t.loadingIcon} Generating Maze...` : `✨ Finding Path...`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl sm:rounded-3xl shadow-xl ${t.loadingBg}`}>
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg border-2 border-white bg-white/60">
              <span className="text-2xl sm:text-3xl">{t.loadingIcon}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{t.loadingTitle}</h3>
            <p className="text-sm sm:text-base">{t.loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
