'use client';
import React, { useState } from 'react';

interface NavbarProps {
  generatingMaze: boolean;
  visualizingAlgorithm: boolean;
  onGenerateMaze: () => void;
  onBFS: () => void;
  onDFS: () => void;
  onClear: () => void;
  selectedAlgorithm: string;
  setSelectedAlgorithm: (algorithm: string) => void;
  executionTime: number;
  theme: string;
  setTheme: (theme: string) => void;
  navbarClass: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  generatingMaze,
  visualizingAlgorithm,
  onGenerateMaze,
  onBFS,
  onDFS,
  onClear,
  selectedAlgorithm,
  setSelectedAlgorithm,
  executionTime,
  theme,
  setTheme,
  navbarClass,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAlgorithmSelect = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    setIsDropdownOpen(false);
  };

  const runSelectedAlgorithm = () => {
    if (selectedAlgorithm === 'BFS') {
      onBFS();
    } else if (selectedAlgorithm === 'DFS') {
      onDFS();
    }
  };

  // Theme name map for navbar title
  const themeNameMap: Record<string, string> = {
    'hello-kitty': 'Hello Kitty Maze',
    'barbie': 'Barbie Dream Maze',
    'batman': 'Gotham Maze Solver',
    'default': 'Maze Solver',
  };
  const mazeTitle = themeNameMap[theme] || themeNameMap['default'];

  // Theme logo map for navbar
  const themeLogoMap: Record<string, string> = {
    'hello-kitty': '🎀',
    'barbie': '👑',
    'batman': '🦇',
    'default': '🧩',
  };
  const logoEmoji = themeLogoMap[theme] || themeLogoMap['default'];

  // Theme logo background map
  const themeLogoBgMap: Record<string, string> = {
    'hello-kitty': 'bg-gradient-to-br from-pink-100 to-pink-300 border-pink-200',
    'barbie': 'bg-gradient-to-br from-pink-400 to-purple-400 border-pink-400',
    'batman': 'bg-gradient-to-br from-yellow-400 to-gray-900 border-yellow-500',
    'default': 'bg-gradient-to-br from-blue-200 to-purple-200 border-blue-200',
  };
  const logoBg = themeLogoBgMap[theme] || themeLogoBgMap['default'];

  // Theme title color map
  const themeTitleColorMap: Record<string, string> = {
    'hello-kitty': 'text-pink-500',
    'barbie': 'text-pink-600',
    'batman': 'text-yellow-400',
    'default': 'text-blue-600',
  };
  const titleColor = themeTitleColorMap[theme] || themeTitleColorMap['default'];

  // Theme button style map
  const buttonStyles: Record<string, { primary: string; secondary: string; run: string; clear: string; exec: string }> = {
    'hello-kitty': {
      primary: 'bg-gradient-to-r from-pink-200 to-pink-400 text-pink-700 border-pink-200',
      secondary: 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-600 border-pink-100',
      run: 'bg-gradient-to-r from-pink-300 to-pink-400 text-white border-pink-200',
      clear: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-gray-200',
      exec: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-400 border-pink-200',
    },
    'barbie': {
      primary: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-300',
      secondary: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-300',
      run: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-300',
      clear: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300',
      exec: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 border-pink-300',
    },
    'batman': {
      primary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-yellow-400',
      secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-300 border-yellow-700',
      run: 'bg-gradient-to-r from-blue-700 to-blue-900 text-white border-blue-700',
      clear: 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 border-gray-700',
      exec: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border-yellow-400',
    },
    'default': {
      primary: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-blue-300',
      secondary: 'bg-gradient-to-r from-green-400 to-green-600 text-white border-green-300',
      run: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-300',
      clear: 'bg-gradient-to-r from-gray-200 to-gray-400 text-gray-700 border-gray-300',
      exec: 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-600 border-blue-200',
    },
  };
  const btn = buttonStyles[theme] || buttonStyles['default'];

  return (
    <nav className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow border-2 ${logoBg}`}>
              <span className="text-lg sm:text-xl">{logoEmoji}</span>
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight ${titleColor}`}>
                {mazeTitle}
              </h1>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Generate Maze Button */}
            <button
              onClick={onGenerateMaze}
              disabled={generatingMaze || visualizingAlgorithm}
              className={`px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 ${btn.primary}`}
            >
              {generatingMaze ? `${logoEmoji} Generating...` : `${logoEmoji} New Maze`}
            </button>

            {/* Algorithm Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={visualizingAlgorithm}
                className={`px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 flex items-center space-x-2 ${btn.secondary}`}
              >
                <span>✨ {selectedAlgorithm}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-pink-200 rounded-lg shadow-2xl z-50">
                  <button
                    onClick={() => handleAlgorithmSelect('BFS')}
                    className="block w-full text-left px-4 py-3 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-colors duration-200 font-semibold"
                  >
                    {logoEmoji} BFS (Breadth First)
                  </button>
                  <button
                    onClick={() => handleAlgorithmSelect('DFS')}
                    className="block w-full text-left px-4 py-3 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-colors duration-200 font-semibold"
                  >
                    🏠 DFS (Depth First)
                  </button>
                </div>
              )}
            </div>

            {/* Run Algorithm Button */}
            <button
              onClick={runSelectedAlgorithm}
              disabled={visualizingAlgorithm || generatingMaze}
              className={`px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 ${btn.run}`}
            >
              {visualizingAlgorithm ? '✨ Solving...' : '✨ Solve'}
            </button>

            {/* Clear Button */}
            <button
              onClick={onClear}
              disabled={generatingMaze || visualizingAlgorithm}
              className={`px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 ${btn.clear}`}
            >
              🗑️ Clear
            </button>

            {/* Execution Time Display */}
            {executionTime > 0 && (
              <div className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg border-2 ${btn.exec}`}>
                <span className="font-bold">⏱️</span>
                <span className="font-semibold text-sm">
                  {executionTime}ms
                </span>
              </div>
            )}

            {/* Theme Switcher */}
            <div>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className="px-3 py-2 rounded-lg border-2 border-pink-200 bg-white text-pink-500 font-semibold shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              >
                <option value="hello-kitty">Hello Kitty</option>
                <option value="barbie">Barbie</option>
                <option value="batman">Batman</option>
                <option value="default">Default</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};