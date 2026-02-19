'use client';

import React, { useState, useEffect, useRef } from 'react';

interface GameState {
  level: number;
  score: number;
  attempts: number;
  gameActive: boolean;
  message: string;
}

interface ButtonPosition {
  x: number;
  y: number;
}

interface ButtonSize {
  width: number;
  height: number;
}

export default function LayoutShiftGame() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const movementTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    attempts: 0,
    gameActive: true,
    message: 'Try to click the button!',
  });

  const [buttonPos, setButtonPos] = useState<ButtonPosition>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'hit' | 'miss' | null>(null);
  const [buttonSize, setButtonSize] = useState<ButtonSize>({ width: 100, height: 50 });

  // Calculate difficulty parameters based on level
  // Difficulty parameters: use rangePercent (fraction of container) so behavior scales on mobile/tablet
  const getDifficultyParams = (level: number) => {
    if (level <= 3) {
      return {
        speed: 200,
        rangePercent: 0.12,
        reactionTime: 300,
        diagonal: false,
      };
    } else if (level <= 7) {
      return {
        speed: 100,
        rangePercent: 0.18,
        reactionTime: 150,
        diagonal: true,
      };
    } else if (level <= 10) {
      return {
        speed: 50,
        rangePercent: 0.28,
        reactionTime: 75,
        diagonal: true,
      };
    } else {
      return {
        speed: 25,
        rangePercent: 0.4,
        reactionTime: 40,
        diagonal: true,
      };
    }
  };

  // Initialize button position
  useEffect(() => {
    if (gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      const initialX = rect.width / 2 - buttonSize.width / 2;
      const initialY = rect.height / 2 - buttonSize.height / 2;
      setButtonPos({ x: initialX, y: initialY });
    }
  }, []);

  // Move button away from cursor
  const moveButton = () => {
    if (!gameContainerRef.current) return;

    const params = getDifficultyParams(gameState.level);
    const rect = gameContainerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Generate random angle
    let angle: number;
    if (params.diagonal) {
      angle = Math.random() * Math.PI * 2; // Random angle in all directions
    } else {
      const directions = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      angle = directions[Math.floor(Math.random() * directions.length)];
    }

    const distance = Math.max(containerWidth, containerHeight) * params.rangePercent * (0.5 + Math.random() * 0.5);
    let newX = buttonPos.x + Math.cos(angle) * distance;
    let newY = buttonPos.y + Math.sin(angle) * distance;

    // Keep button within container with padding
    const padding = 8;
    const maxX = Math.max(padding, containerWidth - buttonSize.width - padding);
    const maxY = Math.max(padding, containerHeight - buttonSize.height - padding);
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    setButtonPos({ x: newX, y: newY });
  };

  // Handle button hover - move it away
  const handleButtonHover = () => {
    if (!gameState.gameActive || isMoving) return;

    const params = getDifficultyParams(gameState.level);

    // Clear previous timeout
    if (movementTimeoutRef.current) {
      clearTimeout(movementTimeoutRef.current);
    }

    setIsMoving(true);
    setShowFeedback(null);

    // Move button after reaction time
    movementTimeoutRef.current = setTimeout(() => {
      moveButton();
      setIsMoving(false);
    }, params.reactionTime);
  };

  // Update measured button size and center when button or container changes (responsive)
  useEffect(() => {
    const updateSizes = () => {
      if (buttonRef.current) {
        const bRect = buttonRef.current.getBoundingClientRect();
        setButtonSize({ width: bRect.width, height: bRect.height });
      }
      if (gameContainerRef.current && buttonRef.current) {
        const cRect = gameContainerRef.current.getBoundingClientRect();
        const bRect = buttonRef.current.getBoundingClientRect();
        setButtonPos({ x: cRect.width / 2 - bRect.width / 2, y: cRect.height / 2 - bRect.height / 2 });
      }
    };

    // Initial measurement
    updateSizes();

    // Recompute on resize or orientation change
    window.addEventListener('resize', updateSizes);
    window.addEventListener('orientationchange', updateSizes);
    return () => {
      window.removeEventListener('resize', updateSizes);
      window.removeEventListener('orientationchange', updateSizes);
    };
  }, []);

  // Handle successful click
  const handleButtonClick = (e: React.MouseEvent) => {
    if (!gameState.gameActive) return;

    e.preventDefault();

    setShowFeedback('hit');
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      message: `Level ${prev.level} Complete! 🎉`,
    }));

    // Move to next level
    setTimeout(() => {
      setShowFeedback(null);
      setGameState((prev) => ({
        ...prev,
        level: prev.level + 1,
        attempts: 0,
        message: `Level ${prev.level + 1} - Get ready!`,
      }));

      // Reset button position
      if (gameContainerRef.current) {
          const rect = gameContainerRef.current.getBoundingClientRect();
          setButtonPos({
            x: rect.width / 2 - buttonSize.width / 2,
            y: rect.height / 2 - buttonSize.height / 2,
          });
      }
    }, 1000);
  };

  // Track missed clicks
  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === buttonRef.current) return;

    if (gameState.gameActive) {
      setShowFeedback('miss');
      setGameState((prev) => ({
        ...prev,
        attempts: prev.attempts + 1,
        message: `Missed! Attempts: ${prev.attempts + 1}`,
      }));

      setTimeout(() => {
        setShowFeedback(null);
      }, 300);
    }
  };

  const resetGame = () => {
    setGameState({
      level: 1,
      score: 0,
      attempts: 0,
      gameActive: true,
      message: 'Try to click the button!',
    });
    if (gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      setButtonPos({
        x: rect.width / 2 - buttonSize.width / 2,
        y: rect.height / 2 - buttonSize.height / 2,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">Layout Shift Game</h1>
          <p className="text-base sm:text-lg text-purple-300">Can you catch the elusive button?</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-800/50 backdrop-blur rounded-lg p-4 text-center border border-purple-600">
            <p className="text-purple-300 text-sm font-semibold">LEVEL</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{gameState.level}</p>
          </div>
          <div className="bg-purple-800/50 backdrop-blur rounded-lg p-4 text-center border border-purple-600">
            <p className="text-purple-300 text-sm font-semibold">SCORE</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{gameState.score}</p>
          </div>
          <div className="bg-purple-800/50 backdrop-blur rounded-lg p-4 text-center border border-purple-600">
            <p className="text-purple-300 text-sm font-semibold">ATTEMPTS</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{gameState.attempts}</p>
          </div>
        </div>

        {/* Game Container */}
        <div
          ref={gameContainerRef}
          onClick={handleContainerClick}
          className="relative w-full h-72 sm:h-80 md:h-96 bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border-2 border-purple-600 shadow-2xl overflow-hidden cursor-crosshair touch-none"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(120,119,198,.05)_25%,rgba(120,119,198,.05)_26%,transparent_27%,transparent_74%,rgba(120,119,198,.05)_75%,rgba(120,119,198,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(120,119,198,.05)_25%,rgba(120,119,198,.05)_26%,transparent_27%,transparent_74%,rgba(120,119,198,.05)_75%,rgba(120,119,198,.05)_76%,transparent_77%,transparent)] bg-[50px_50px]"></div>
          </div>

          {/* Evasive Button */}
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            onMouseEnter={handleButtonHover}
            onPointerEnter={handleButtonHover}
            onPointerDown={handleButtonHover}
            onTouchStart={handleButtonHover}
            className="absolute w-20 sm:w-24 md:w-28 h-10 sm:h-12 md:h-14 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold rounded-full shadow-lg transition-transform duration-100 transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-cyan-300 z-10"
            style={{
              left: `${buttonPos.x}px`,
              top: `${buttonPos.y}px`,
              opacity: showFeedback === 'hit' ? 1 : 1,
            }}
          >
            Click Me!
          </button>

          {/* Feedback Indicators */}
          {showFeedback === 'hit' && (
            <div className="absolute inset-0 bg-green-500 opacity-20 animate-pulse rounded-lg"></div>
          )}
          {showFeedback === 'miss' && (
            <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse rounded-lg"></div>
          )}

          {/* Message Display */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-lg font-semibold text-white drop-shadow-lg">
              {gameState.message}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Reset Game
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-purple-900/30 backdrop-blur rounded-lg p-6 border border-purple-600">
          <h2 className="text-xl font-bold text-white mb-4">How to Play</h2>
          <ul className="space-y-2 text-purple-200">
            <li>✓ Try to click the cyan button as many times as possible</li>
            <li>✓ Each successful click advances to the next level</li>
            <li>✓ The button moves faster and further as levels increase</li>
            <li>✓ Can you reach level 20? 🚀</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
