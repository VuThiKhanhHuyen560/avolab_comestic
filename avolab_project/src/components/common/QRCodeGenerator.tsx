import React from 'react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  className = '',
  showLabel = true
}) => {
  // Deterministic 21x21 QR Code Generator with standard finder patterns
  const GRID_SIZE = 21;
  const grid: boolean[][] = Array(GRID_SIZE).fill(false).map(() => Array(GRID_SIZE).fill(false));

  // Helper to set finder pattern at (r, c)
  const drawFinderPattern = (startR: number, startC: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer 7x7 ring
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)       // Inner 3x3 square
        ) {
          grid[startR + r][startC + c] = true;
        } else {
          grid[startR + r][startC + c] = false;
        }
      }
    }
  };

  // 1. Top-Left Finder
  drawFinderPattern(0, 0);
  // 2. Top-Right Finder
  drawFinderPattern(0, GRID_SIZE - 7);
  // 3. Bottom-Left Finder
  drawFinderPattern(GRID_SIZE - 7, 0);

  // Timing Patterns
  for (let i = 8; i < GRID_SIZE - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Generate pseudo-random modules from text hash for data area
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }

  const isReserved = (r: number, c: number) => {
    if (r < 8 && c < 8) return true; // TL
    if (r < 8 && c >= GRID_SIZE - 8) return true; // TR
    if (r >= GRID_SIZE - 8 && c < 8) return true; // BL
    if (r === 6 || c === 6) return true; // Timing
    return false;
  };

  let seed = Math.abs(hash) || 12345;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!isReserved(r, c)) {
        grid[r][c] = pseudoRandom() > 0.45;
      }
    }
  }

  const cellSize = size / (GRID_SIZE + 2); // includes 1 cell quiet zone margin

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className="bg-white p-3 rounded-2xl border-2 border-[#4A5D4E]/20 shadow-md flex items-center justify-center"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="rounded"
        >
          {/* Quiet Zone White Background */}
          <rect width={size} height={size} fill="#FFFFFF" />
          
          {/* QR Grid Modules */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              const x = (c + 1) * cellSize;
              const y = (r + 1) * cellSize;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={cellSize + 0.3} // tiny overlap prevents hairline gaps
                  height={cellSize + 0.3}
                  fill="#1C2E20"
                />
              );
            })
          )}
        </svg>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <p className="text-[10px] font-mono tracking-widest text-[#4A5D4E] font-bold uppercase">
            {value.length > 28 ? value.slice(0, 25) + '...' : value}
          </p>
        </div>
      )}
    </div>
  );
};
