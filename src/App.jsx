import React, { useState, useEffect } from 'react'

// Elegant sparkle animation styles
const sparkleStyles = `
  @keyframes sparkle-rise {
    0% {
      transform: translateY(0) scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: translateY(-20px) scale(1) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-40px) scale(0) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes gentle-glow {
    0%, 100% {
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    }
  }
  
  .sparkle {
    animation: sparkle-rise 1.5s ease-out infinite;
    animation-delay: var(--delay);
  }
  
  .success-glow {
    animation: gentle-glow 1s ease-in-out infinite;
  }
`

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = sparkleStyles
  document.head.appendChild(styleSheet)
}

// Game states
const GAME_STATES = {
  WELCOME: 'welcome',
  PLAYING: 'playing',
  INSTRUCTIONS: 'instructions',
  LEVEL_SELECT: 'level_select'
}

// Level configurations with multiple path variations
const LEVELS = {
  1: {
    name: "Turtle's Maze Challenge", 
    creature: "🐢",
    goal: "🏝️",
    gridSize: 5,
    start: { x: 0, y: 0 },
    end: { x: 4, y: 4 },
    pathVariations: [
      {
        // Variation A: Classic zigzag
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
          { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 },
          { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
          { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 4 }
        ],
        obstacles: [
          { x: 4, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
          { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 4 }, { x: 2, y: 4 },
          { x: 1, y: 4 }, { x: 0, y: 4 }
        ]
      },
      {
        // Variation B: Diagonal spiral
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
          { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 },
          { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
          { x: 4, y: 3 }, { x: 4, y: 4 }
        ],
        obstacles: [
          { x: 0, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
          { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 },
          { x: 2, y: 4 }, { x: 3, y: 4 }
        ]
      },
      {
        // Variation C: Border hug
        correctPath: [
          { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 },
          { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 },
          { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 1 },
          { x: 4, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 },
          { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2 },
          { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 2 }
        ],
        obstacles: [
          { x: 1, y: 2 }, { x: 1, y: 3 }
        ]
      }
    ],
    viewTime: 3000,
    selectionTime: 6000,
    background: "from-violet-100 via-purple-50 to-indigo-100"
  },
  2: {
    name: "Cat's Nightmare Maze",
    creature: "🐱", 
    goal: "🐟",
    gridSize: 6,
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    pathVariations: [
      {
        // Variation A: Snake zigzag
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
          { x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 },
          { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
          { x: 5, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 },
          { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
          { x: 5, y: 5 }
        ],
        obstacles: [
          { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }
        ]
      },
      {
        // Variation B: Spiral inward
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
          { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
          { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }, { x: 0, y: 5 },
          { x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 },
          { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
          { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
          { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 },
          { x: 1, y: 3 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }
        ],
        obstacles: []
      },
      {
        // Variation C: Diagonal maze
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 0 }, 
          { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 4, y: 3 }, { x: 3, y: 2 }, { x: 2, y: 3 },
          { x: 1, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 },
          { x: 2, y: 4 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 5 }
        ],
        obstacles: [
          { x: 1, y: 0 }, { x: 3, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 1 },
          { x: 4, y: 1 }, { x: 1, y: 2 }, { x: 4, y: 2 }, { x: 0, y: 2 }, { x: 5, y: 3 },
          { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 5 }, { x: 4, y: 5 }
        ]
      }
    ],
    viewTime: 2000,
    selectionTime: 7000,
    background: "from-red-100 via-orange-50 to-yellow-100"
  },
  3: {
    name: "Dragon's Spiral Tower",
    creature: "🐉", 
    goal: "💎",
    gridSize: 7,
    start: { x: 3, y: 6 },
    end: { x: 3, y: 0 },
    pathVariations: [
      {
        // Variation A: Counter-clockwise spiral
        correctPath: [
          { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 6 }, { x: 0, y: 6 },
          { x: 0, y: 5 }, { x: 0, y: 4 }, { x: 0, y: 3 },
          { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
          { x: 6, y: 2 }, { x: 6, y: 1 },
          { x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 },
          { x: 2, y: 0 }, { x: 3, y: 0 }
        ],
        obstacles: [
          { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
          { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 },
          { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 6, y: 4 },
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
          { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 6, y: 1 }
        ]
      },
      {
        // Variation B: Clockwise spiral
        correctPath: [
          { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
          { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
          { x: 5, y: 0 }, { x: 4, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 },
          { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 },
          { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
          { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 },
          { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 },
          { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 },
          { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
          { x: 4, y: 3 }, { x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }
        ],
        obstacles: [
          { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }
        ]
      },
      {
        // Variation C: Diagonal climb
        correctPath: [
          { x: 3, y: 6 }, { x: 2, y: 5 }, { x: 1, y: 4 }, { x: 0, y: 3 },
          { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 0 }
        ],
        obstacles: [
          { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
          { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 },
          { x: 0, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 },
          { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
          { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 },
          { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 },
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }
        ]
      }
    ],
    viewTime: 2500,
    selectionTime: 8000,
    background: "from-purple-100 via-pink-50 to-red-100"
  },
  4: {
    name: "Rabbit's Garden Maze",
    creature: "🐰", 
    goal: "🥕",
    gridSize: 8,
    start: { x: 0, y: 0 },
    end: { x: 7, y: 7 },
    pathVariations: [
      {
        // Variation A: Border journey
        correctPath: [
          { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
          { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
          { x: 7, y: 3 }, { x: 7, y: 2 }, { x: 7, y: 1 }, { x: 7, y: 0 },
          { x: 6, y: 0 }, { x: 5, y: 0 }, { x: 4, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 },
          { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
          { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
          { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 }
        ],
        obstacles: [
          { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
          { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
          { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 },
          { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 },
          { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 },
          { x: 0, y: 5 }, { x: 7, y: 5 }, { x: 7, y: 6 }
        ]
      },
      {
        // Variation B: Diagonal snake
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 2 }, { x: 5, y: 1 },
          { x: 6, y: 2 }, { x: 7, y: 3 }, { x: 6, y: 4 }, { x: 5, y: 5 }, { x: 4, y: 6 }, { x: 3, y: 7 },
          { x: 4, y: 7 }, { x: 5, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 6 }, { x: 7, y: 7 }
        ],
        obstacles: [
          { x: 1, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
          { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 },
          { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 },
          { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
          { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 7, y: 4 },
          { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
          { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
          { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 5, y: 7 }
        ]
      },
      {
        // Variation C: Inner spiral
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
          { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
          { x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 7 }, { x: 0, y: 7 },
          { x: 0, y: 6 }, { x: 0, y: 5 }, { x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 },
          { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 },
          { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 },
          { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 6 },
          { x: 1, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 },
          { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
          { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
          { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 },
          { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 3, y: 4 }
        ],
        obstacles: []
      }
    ],
    viewTime: 1500,
    selectionTime: 10000,
    background: "from-green-100 via-emerald-50 to-teal-100"
  }
}

// Helper function to hide the path preview
const hidePathInGrid = (grid) => {
  return grid.map(row => 
    row.map(tile => ({
      ...tile,
      isPath: false // Hide the blue path preview
    }))
  )
}

// Game phases within playing state  
const GAME_PHASES = {
  PATH_PREVIEW: 'path_preview',  // Show the correct path for a few seconds
  PATH_SELECTION: 'path_selection', // User clicks to recreate the path
  CREATURE_MOVING: 'creature_moving', // Animate creature along user's path
  RESULT: 'result' // Show success/failure result
}

// Helper function to create initial grid
const createInitialGrid = (level, pathVariation = null) => {
  // Use path variation if provided, otherwise use first variation as fallback
  const variation = pathVariation || level.pathVariations[0]
  
  const grid = []
  for (let y = 0; y < level.gridSize; y++) {
    const row = []
    for (let x = 0; x < level.gridSize; x++) {
      row.push({
        x,
        y,
        isStart: x === level.start.x && y === level.start.y,
        isGoal: x === level.end.x && y === level.end.y,
        isPath: variation.correctPath.some(p => p.x === x && p.y === y),
        isSelectedByUser: false,
        isObstacle: variation.obstacles.some(o => o.x === x && o.y === y),
        isCreatureHere: x === level.start.x && y === level.start.y, // creature starts here
        isTrail: false, // New trail effect
        trailAge: 0 // New trail effect
      })
    }
    grid.push(row)
  }
  return grid
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.WELCOME)
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.PATH_PREVIEW)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [unlockedLevels, setUnlockedLevels] = useState([1]) // Only level 1 unlocked initially
  const [grid, setGrid] = useState(() => createInitialGrid(LEVELS[1]))
  const [timeLeft, setTimeLeft] = useState(LEVELS[1].viewTime / 1000)
  const [selectionTimeLeft, setSelectionTimeLeft] = useState(LEVELS[1].selectionTime / 1000)
  const [score, setScore] = useState(0)
  const [userPath, setUserPath] = useState([]) // Track user's selected path
  const [creaturePosition, setCreaturePosition] = useState(LEVELS[1].start) // For animation
  const [isDrawing, setIsDrawing] = useState(false) // Track if user is actively drawing
  const [drawMode, setDrawMode] = useState('add') // 'add' or 'remove' - what happens when dragging
  const [showSparkles, setShowSparkles] = useState(false) // For elegant sparkle effects
  const [animationProgress, setAnimationProgress] = useState(0) // Track creature animation progress
  
  // Advanced Scoring System
  const [detailedScore, setDetailedScore] = useState({
    baseScore: 0,
    speedBonus: 0,
    perfectBonus: 0,
    comboMultiplier: 1,
    totalScore: 0
  })
  const [perfectStreak, setPerfectStreak] = useState(0)
  const [levelStartTime, setLevelStartTime] = useState(null)
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('tileTownHighScores')
    return saved ? JSON.parse(saved) : {}
  })
  const [totalGameScore, setTotalGameScore] = useState(() => {
    const saved = localStorage.getItem('tileTownTotalScore')
    return saved ? parseInt(saved) : 0
  })
  
  // Random path selection state
  const [currentPathVariation, setCurrentPathVariation] = useState(null)
  
  const currentLevelData = LEVELS[currentLevel]
  
  // Path Randomization Functions
  const selectRandomPathVariation = (levelNumber) => {
    const level = LEVELS[levelNumber]
    const randomIndex = Math.floor(Math.random() * level.pathVariations.length)
    return level.pathVariations[randomIndex]
  }
  
  const getCurrentPath = () => {
    return currentPathVariation ? currentPathVariation.correctPath : []
  }
  
  const getCurrentObstacles = () => {
    return currentPathVariation ? currentPathVariation.obstacles : []
  }
  
  // Advanced Scoring Functions
  const calculateScore = (accuracy, timeUsed, isPerfect) => {
    const maxTime = currentLevelData.selectionTime / 1000
    const baseScore = Math.round(accuracy * 1000) // Base score out of 1000
    
    // Speed bonus: up to 500 points for completing quickly
    const timeRatio = 1 - (timeUsed / maxTime)
    const speedBonus = Math.round(timeRatio * 500)
    
    // Perfect bonus: 300 points for 100% accuracy
    const perfectBonus = isPerfect ? 300 : 0
    
    // Combo multiplier: increases with perfect streak
    const comboMultiplier = 1 + (perfectStreak * 0.2) // 20% per perfect level
    
    const subtotal = baseScore + speedBonus + perfectBonus
    const totalScore = Math.round(subtotal * comboMultiplier)
    
    return {
      baseScore,
      speedBonus,
      perfectBonus,
      comboMultiplier,
      totalScore
    }
  }
  
  const saveHighScore = (levelNum, score) => {
    const newHighScores = { ...highScores }
    if (!newHighScores[levelNum] || score > newHighScores[levelNum]) {
      newHighScores[levelNum] = score
      setHighScores(newHighScores)
      localStorage.setItem('tileTownHighScores', JSON.stringify(newHighScores))
    }
  }
  
  const updateTotalScore = (points) => {
    const newTotal = totalGameScore + points
    setTotalGameScore(newTotal)
    localStorage.setItem('tileTownTotalScore', newTotal.toString())
  }
  
  const startGame = (levelNumber = currentLevel) => {
    const level = LEVELS[levelNumber]
    
    // Select random path variation for this playthrough
    const selectedVariation = selectRandomPathVariation(levelNumber)
    setCurrentPathVariation(selectedVariation)
    
    setCurrentLevel(levelNumber)
    setGameState(GAME_STATES.PLAYING)
    setGamePhase(GAME_PHASES.PATH_PREVIEW)
    
    // Create grid with the selected random variation
    setGrid(createInitialGrid(level, selectedVariation))
    setTimeLeft(level.viewTime / 1000)
    setSelectionTimeLeft(level.selectionTime / 1000)
    setScore(0)
    setUserPath([])
    setCreaturePosition(level.start)
    setIsDrawing(false)
    setDrawMode('add')
    setShowSparkles(false)
    setAnimationProgress(0)
    
    // Initialize scoring for this level
    setDetailedScore({
      baseScore: 0,
      speedBonus: 0,
      perfectBonus: 0,
      comboMultiplier: 1 + (perfectStreak * 0.2),
      totalScore: 0
    })
    setLevelStartTime(Date.now())
  }
  
  const showInstructions = () => {
    setGameState(GAME_STATES.INSTRUCTIONS)
  }
  
  const backToWelcome = () => {
    setGameState(GAME_STATES.WELCOME)
  }
  
  const showLevelSelect = () => {
    setGameState(GAME_STATES.LEVEL_SELECT)
  }
  
  const unlockNextLevel = () => {
    const nextLevel = currentLevel + 1
    if (LEVELS[nextLevel] && !unlockedLevels.includes(nextLevel)) {
      setUnlockedLevels([...unlockedLevels, nextLevel])
    }
  }
  
  // Tile component - handles different tile states
  const Tile = ({ tile, onClick, onMouseDown, onMouseEnter, onMouseUp, gamePhase }) => {
    const isClickable = gamePhase === GAME_PHASES.PATH_SELECTION && !tile.isStart && !tile.isGoal && !tile.isObstacle
    
    // Determine tile appearance based on state
    let content = ""
    let bgColor = "bg-slate-100"
    let borderColor = "border-slate-300"
    let textColor = "text-slate-600"
    
    // Start and goal always visible
    if (tile.isStart) {
      content = tile.isCreatureHere ? LEVELS[currentLevel].creature : "🏁"
      bgColor = "bg-green-100"
      borderColor = "border-green-400"
    } else if (tile.isGoal) {
      content = LEVELS[currentLevel].goal
      bgColor = "bg-blue-100" 
      borderColor = "border-blue-400"
    } else if (tile.isObstacle && gamePhase !== GAME_PHASES.PATH_SELECTION) {
      // Hide obstacles during path selection to create confusion!
      content = "🪨"
      bgColor = "bg-gray-300"
      borderColor = "border-gray-500"
    } else if (tile.isHiddenObstacleHit) {
      // Flash red when player hits a hidden obstacle
      content = "❌"
      bgColor = "bg-red-400"
      borderColor = "border-red-600"
    } else if (gamePhase === GAME_PHASES.PATH_PREVIEW && tile.isPath && !tile.isStart && !tile.isGoal) {
      // Show correct path during preview
      bgColor = "bg-blue-400"
      borderColor = "border-blue-600"
      content = "🟦"
    } else if (tile.isSelectedByUser) {
      // User's selected path
      bgColor = "bg-green-400"
      borderColor = "border-green-600"  
      content = "🟩"
    } else if (tile.isTrail) { // New trail effect
      bgColor = "bg-blue-200" // Light blue for trail
      borderColor = "border-blue-300"
      content = "✨" // Sparkle for trail instead of blue square
    } else {
      // Empty tile (or hidden obstacle!)
      content = ""
      bgColor = "bg-slate-50"
    }
    
    return (
      <button
        onClick={() => onClick && onClick(tile.x, tile.y)}
        onMouseDown={() => onMouseDown && onMouseDown(tile.x, tile.y)}
        onMouseEnter={() => onMouseEnter && onMouseEnter(tile.x, tile.y)}
        onMouseUp={() => onMouseUp && onMouseUp()}
        onTouchStart={() => onMouseDown && onMouseDown(tile.x, tile.y)}
        onTouchMove={(e) => {
          e.preventDefault()
          const touch = e.touches[0]
          const element = document.elementFromPoint(touch.clientX, touch.clientY)
          if (element && element.dataset && element.dataset.coords) {
            const [x, y] = element.dataset.coords.split(',').map(Number)
            onMouseEnter && onMouseEnter(x, y)
          }
        }}
        onTouchEnd={() => onMouseUp && onMouseUp()}
        data-coords={`${tile.x},${tile.y}`}
        disabled={!isClickable}
        className={`
          w-16 h-16 text-xl rounded-lg border-2 transition-all duration-150
          ${bgColor} ${borderColor} ${textColor}
          ${isClickable 
            ? 'hover:scale-105 hover:shadow-md cursor-pointer active:scale-95' 
            : 'cursor-default'
          }
          flex items-center justify-center font-bold select-none
        `}
      >
        {content}
      </button>
    )
  }
  
  // Grid component
  const Grid = ({ grid, onTileClick, onTileMouseDown, onTileMouseEnter, onTileMouseUp, gamePhase }) => (
    <div className={`grid gap-2 p-4 bg-slate-200 rounded-xl select-none`} 
         style={{gridTemplateColumns: `repeat(${currentLevelData.gridSize}, minmax(0, 1fr))`}}>
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            tile={tile}
            onClick={onTileClick}
            onMouseDown={onTileMouseDown}
            onMouseEnter={onTileMouseEnter}
            onMouseUp={onTileMouseUp}
            gamePhase={gamePhase}
          />
        ))
      )}
    </div>
  )
  
  // Handle tile interactions during path selection phase
  const handleTileClick = (x, y) => {
    if (gamePhase !== GAME_PHASES.PATH_SELECTION) return
    
    const newGrid = [...grid]
    const tile = newGrid[y][x]
    
    // Don't allow clicking on start, goal, or obstacles
    if (tile.isStart || tile.isGoal || tile.isObstacle) {
      // Give subtle feedback for hidden obstacles
      if (tile.isObstacle) {
        // Flash red briefly to show they hit a hidden obstacle
        tile.isHiddenObstacleHit = true
        setGrid([...newGrid])
        setTimeout(() => {
          tile.isHiddenObstacleHit = false
          setGrid([...newGrid])
        }, 300)
      }
      return
    }
    
    // Toggle tile selection
    tile.isSelectedByUser = !tile.isSelectedByUser
    
    // Update user path array
    const pathCoord = { x, y }
    if (tile.isSelectedByUser) {
      // Add to path if not already there
      if (!userPath.some(p => p.x === x && p.y === y)) {
        setUserPath([...userPath, pathCoord])
      }
    } else {
      // Remove from path
      setUserPath(userPath.filter(p => !(p.x === x && p.y === y)))
    }
    
    setGrid(newGrid)
  }

  // Handle mouse down - start drawing
  const handleTileMouseDown = (x, y) => {
    if (gamePhase !== GAME_PHASES.PATH_SELECTION) return
    
    const tile = grid[y][x]
    if (tile.isStart || tile.isGoal || tile.isObstacle) return
    
    setIsDrawing(true)
    // Determine draw mode based on current tile state
    setDrawMode(tile.isSelectedByUser ? 'remove' : 'add')
    
    // Apply the action to this tile
    handleTileAction(x, y)
  }

  // Handle mouse enter - continue drawing if mouse is down
  const handleTileMouseEnter = (x, y) => {
    if (!isDrawing || gamePhase !== GAME_PHASES.PATH_SELECTION) return
    
    const tile = grid[y][x]
    if (tile.isStart || tile.isGoal || tile.isObstacle) return
    
    handleTileAction(x, y)
  }

  // Handle mouse up - stop drawing
  const handleTileMouseUp = () => {
    setIsDrawing(false)
  }

  // Apply add/remove action to a tile
  const handleTileAction = (x, y) => {
    const newGrid = [...grid]
    const tile = newGrid[y][x]
    const pathCoord = { x, y }
    
    if (drawMode === 'add' && !tile.isSelectedByUser) {
      // Add tile to selection
      tile.isSelectedByUser = true
      if (!userPath.some(p => p.x === x && p.y === y)) {
        setUserPath(prev => [...prev, pathCoord])
      }
    } else if (drawMode === 'remove' && tile.isSelectedByUser) {
      // Remove tile from selection
      tile.isSelectedByUser = false
      setUserPath(prev => prev.filter(p => !(p.x === x && p.y === y)))
    }
    
    setGrid(newGrid)
  }
  
  // Check if user's path matches the correct path
  const checkPath = () => {
    // Add start and end to user path for comparison
    const fullUserPath = [LEVELS[currentLevel].start, ...userPath, LEVELS[currentLevel].end]
    const correctPath = getCurrentPath() // Use the randomly selected path variation
    
    // Check if paths match exactly (same length and same coordinates)
    let isCorrect = fullUserPath.length === correctPath.length
    
    if (isCorrect) {
      for (let i = 0; i < fullUserPath.length; i++) {
        if (fullUserPath[i].x !== correctPath[i].x || fullUserPath[i].y !== correctPath[i].y) {
          isCorrect = false
          break
        }
      }
    }
    
    // Calculate advanced scoring
    const accuracy = isCorrect ? 1.0 : Math.min(userPath.length / (correctPath.length - 2), 1.0)
    const timeUsed = (currentLevelData.selectionTime / 1000) - selectionTimeLeft
    const isPerfect = isCorrect
    
    const newScore = calculateScore(accuracy, timeUsed, isPerfect)
    setDetailedScore(newScore)
    setScore(Math.round(accuracy * 100)) // Keep old score for compatibility
    
    // Update perfect streak
    if (isPerfect) {
      setPerfectStreak(prev => prev + 1)
      setShowSparkles(true)
      setTimeout(() => setShowSparkles(false), 3000)
    } else {
      setPerfectStreak(0) // Reset streak on non-perfect
    }
    
    // Save high score and update total
    saveHighScore(currentLevel, newScore.totalScore)
    updateTotalScore(newScore.totalScore)
    
    // Start creature animation along user's path
    setGamePhase(GAME_PHASES.CREATURE_MOVING)
    animateCreature(fullUserPath, isCorrect)
  }
  
  // Animate creature moving along the path
  const animateCreature = (path, isCorrect) => {
    let stepIndex = 0
    const totalSteps = path.length
    
    const animationInterval = setInterval(() => {
      if (stepIndex < path.length) {
        // Update progress
        setAnimationProgress(Math.round((stepIndex / totalSteps) * 100))
        
        // Update creature position
        setCreaturePosition(path[stepIndex])
        
        // Update grid to show creature position with trail
        const newGrid = [...grid]
        // Clear creature from all tiles but keep trail
        newGrid.forEach(row => row.forEach(tile => {
          tile.isCreatureHere = false
          // Remove old trail markers older than 3 steps
          if (tile.trailAge > 3) {
            tile.isTrail = false
            tile.trailAge = 0
          } else if (tile.isTrail) {
            tile.trailAge = (tile.trailAge || 0) + 1
          }
        }))
        
        // Set creature at current position
        if (path[stepIndex]) {
          const currentTile = newGrid[path[stepIndex].y][path[stepIndex].x]
          currentTile.isCreatureHere = true
          
          // Add trail for previous position
          if (stepIndex > 0 && path[stepIndex - 1]) {
            const prevTile = newGrid[path[stepIndex - 1].y][path[stepIndex - 1].x]
            if (!prevTile.isStart && !prevTile.isGoal) {
              prevTile.isTrail = true
              prevTile.trailAge = 1
            }
          }
        }
        
        setGrid(newGrid)
        stepIndex++
      } else {
        // Animation complete
        clearInterval(animationInterval)
        setAnimationProgress(100)
        
        // Clear all trail effects
        const finalGrid = [...grid]
        finalGrid.forEach(row => row.forEach(tile => {
          tile.isTrail = false
          tile.trailAge = 0
        }))
        setGrid(finalGrid)
        
        // Unlock next level if this level was completed perfectly
        if (isCorrect) {
          unlockNextLevel()
        }
        
        // Show results immediately
        setGamePhase(GAME_PHASES.RESULT)
      }
    }, 200) // Much faster! Move every 200ms instead of 800ms
  }
  
  // Timer effects for path preview and selection phases
  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) return

    let timer
    
    if (gamePhase === GAME_PHASES.PATH_PREVIEW) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase(GAME_PHASES.PATH_SELECTION)
            setGrid(hidePathInGrid(grid)) // Hide the correct path
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    else if (gamePhase === GAME_PHASES.PATH_SELECTION) {
      timer = setInterval(() => {
        setSelectionTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up! Auto-submit the current path
            checkPath()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameState, gamePhase, grid])

  // Global mouse up handler to stop drawing if mouse released outside grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawing) {
        setIsDrawing(false)
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('touchend', handleGlobalMouseUp)
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [isDrawing])
  
  // Level Selection Screen
  if (gameState === GAME_STATES.LEVEL_SELECT) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">🌟 Choose Your Adventure 🌟</h2>
            
            {/* Total Score Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{totalGameScore.toLocaleString()} Total Points</div>
                <div className="flex justify-center items-center gap-4 text-sm text-slate-600">
                  <span>🏆 {Object.keys(highScores).length} Levels Played</span>
                  {perfectStreak > 0 && <span>🔥 {perfectStreak} Perfect Streak</span>}
                  <span>🌟 {unlockedLevels.length} Unlocked</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(LEVELS).map(([levelNum, level]) => {
                const isUnlocked = unlockedLevels.includes(parseInt(levelNum))
                const isCompleted = unlockedLevels.includes(parseInt(levelNum) + 1) // Next level unlocked means this one is completed
                
                return (
                  <div
                    key={levelNum}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                      isUnlocked
                        ? 'bg-white/80 border-blue-300 hover:bg-white/90 hover:shadow-lg cursor-pointer'
                        : 'bg-gray-100/50 border-gray-300 cursor-not-allowed opacity-60'
                    }`}
                    onClick={() => isUnlocked && startGame(parseInt(levelNum))}
                  >
                    {/* Level Status Badge */}
                    <div className="absolute -top-2 -right-2">
                      {isCompleted && (
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      )}
                      {!isUnlocked && (
                        <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          🔒
                        </div>
                      )}
                    </div>
                    
                    {/* Level Info */}
                    <div className="text-center">
                      <div className="text-4xl mb-2">{level.creature}</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Level {levelNum}</h3>
                      <p className="text-lg text-slate-600 mb-3">{level.name}</p>
                      <div className="text-sm text-slate-500 space-y-1">
                        <p>📐 Grid: {level.gridSize}×{level.gridSize}</p>
                        <p>⏱️ Study: {level.viewTime/1000}s | Select: {level.selectionTime/1000}s</p>
                        <p>🎯 Goal: Get {level.creature} to {level.goal}</p>
                        <p className="text-orange-600 font-medium">🎲 {level.pathVariations.length} Random Path Layouts</p>
                      </div>
                      
                      {/* High Score Display */}
                      {isUnlocked && highScores[levelNum] && (
                        <div className="mt-3 pt-2 border-t border-slate-200">
                          <p className="text-xs text-blue-600 font-medium">
                            🏆 Best Score: {highScores[levelNum].toLocaleString()} pts
                          </p>
                        </div>
                      )}
                      
                      {!isUnlocked && (
                        <p className="text-sm text-orange-600 mt-3 font-medium">
                          Complete previous level to unlock!
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <button 
              onClick={backToWelcome}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              ← Back to Main Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === GAME_STATES.INSTRUCTIONS) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100">
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">How to Play</h2>
            <div className="space-y-4 text-slate-700">
              <div className="flex items-start gap-3">
                <span className="text-xl">👀</span>
                <p><strong>Study the path:</strong> Watch the blue path carefully - the turtle needs to reach the island!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧠</span>
                <p><strong>Remember everything:</strong> Memorize both the path AND obstacle locations!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🫥</span>
                <p><strong>Hidden obstacles:</strong> Obstacles disappear during your turn - avoid clicking them!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <p><strong>Beat the clock:</strong> You have limited time to recreate the path - work fast!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🖱️</span>
                <p><strong>Draw the path:</strong> Click or drag across tiles to smoothly recreate the route</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎉</span>
                <p><strong>Perfect path = sparkles:</strong> Guide the turtle home for magical celebrations!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏆</span>
                <p><strong>Advanced scoring:</strong> Earn points for accuracy, speed bonuses, perfect completion, and combo multipliers!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎲</span>
                <p><strong>Random paths:</strong> Every playthrough has a different path layout - stay sharp and adapt quickly!</p>
              </div>
            </div>
            <button onClick={backToWelcome} className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Got it!
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === GAME_STATES.PLAYING) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentLevelData.background}`}>
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        
        {/* Elegant Sparkles Overlay */}
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="sparkle absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  '--delay': `${Math.random() * 2}s`,
                  color: '#FFD700',
                  fontSize: `${Math.random() * 20 + 15}px`
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-2xl w-full text-center ${showSparkles ? 'success-glow' : ''}`}>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentLevelData.creature} {currentLevelData.name}</h2>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>Level {currentLevel}</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">🎲 Random Path</span>
              </div>
              {gamePhase === GAME_PHASES.PATH_PREVIEW && (
                <div>
                  <p className="text-slate-600 mb-2">Study the blue path carefully! The {currentLevelData.creature} needs to reach the {currentLevelData.goal}.</p>
                  <div className="text-3xl font-bold text-blue-600">{timeLeft}s</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.PATH_SELECTION && (
                <div>
                  <p className="text-slate-600 mb-2">Draw the path from memory! Obstacles are now hidden - avoid them!</p>
                  <div className="text-2xl font-bold text-orange-600 mb-2">⏰ {selectionTimeLeft}s</div>
                  <p className="text-sm text-slate-500">💡 Green tiles = your path. Red flash = hidden obstacle hit!</p>
                </div>
              )}
              {gamePhase === GAME_PHASES.CREATURE_MOVING && (
                <div>
                  <p className="text-slate-600 mb-2">{currentLevelData.creature} The {currentLevelData.creature.includes('🐢') ? 'turtle' : currentLevelData.creature.includes('🐱') ? 'cat' : currentLevelData.creature.includes('🐉') ? 'dragon' : 'rabbit'} is following your path...</p>
                  <div className="text-lg text-blue-600 mb-2">Watch carefully!</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-200" 
                      style={{width: `${animationProgress}%`}}
                    ></div>
                  </div>
                  <div className="text-sm text-slate-500">{animationProgress}% complete</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.RESULT && (
                <div>
                  <p className="text-slate-600 mb-3">{score === 100 ? "Perfect! 🎉" : "Good try! 👍"}</p>
                  
                  {/* Detailed Score Breakdown */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{detailedScore.totalScore.toLocaleString()} Points!</div>
                    
                    {/* Score Components */}
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Base Score ({score}% accuracy):</span>
                        <span className="font-semibold text-blue-600">+{detailedScore.baseScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Speed Bonus:</span>
                        <span className="font-semibold text-green-600">+{detailedScore.speedBonus}</span>
                      </div>
                      {detailedScore.perfectBonus > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Perfect Bonus:</span>
                          <span className="font-semibold text-purple-600">+{detailedScore.perfectBonus}</span>
                        </div>
                      )}
                      {detailedScore.comboMultiplier > 1 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Streak Multiplier (x{detailedScore.comboMultiplier.toFixed(1)}):</span>
                          <span className="font-semibold text-orange-600">Applied!</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Streak Info */}
                    {perfectStreak > 0 && (
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <p className="text-sm text-purple-600 font-medium">🔥 Perfect Streak: {perfectStreak} levels!</p>
                      </div>
                    )}
                    
                    {/* High Score Info */}
                    {highScores[currentLevel] && (
                      <div className="mt-2 text-xs text-slate-500">
                        Personal Best: {highScores[currentLevel].toLocaleString()} pts
                        {detailedScore.totalScore > highScores[currentLevel] && 
                          <span className="text-green-600 font-medium"> • NEW RECORD! 🏆</span>
                        }
                      </div>
                    )}
                  </div>
                  
                  {score === 100 ? (
                    <p className="text-sm text-green-600 mt-1">The {currentLevelData.creature.includes('🐢') ? 'turtle' : currentLevelData.creature.includes('🐱') ? 'cat' : currentLevelData.creature.includes('🐉') ? 'dragon' : 'rabbit'} made it home! {currentLevelData.goal}</p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">The {currentLevelData.creature.includes('🐢') ? 'turtle' : currentLevelData.creature.includes('🐱') ? 'cat' : currentLevelData.creature.includes('🐉') ? 'dragon' : 'rabbit'} got confused... Try again! 🤔</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Game Grid */}
            <div className="mb-6 flex justify-center">
              <Grid 
                grid={grid} 
                onTileClick={handleTileClick}
                onTileMouseDown={handleTileMouseDown}
                onTileMouseEnter={handleTileMouseEnter}
                onTileMouseUp={handleTileMouseUp}
                gamePhase={gamePhase} 
              />
            </div>
            
            {/* Path Legend */}
            {gamePhase === GAME_PHASES.PATH_PREVIEW && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-4 bg-slate-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                    <span className="text-sm text-slate-600">Correct Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentLevelData.creature}</span>
                    <span className="text-sm text-slate-600">{currentLevelData.creature.includes('🐢') ? 'Turtle' : 'Cat'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentLevelData.goal}</span>
                    <span className="text-sm text-slate-600">Goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪨</span>
                    <span className="text-sm text-slate-600">Obstacle</span>
                  </div>
                </div>
              </div>
            )}
            
            {gamePhase === GAME_PHASES.PATH_SELECTION && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-4 bg-slate-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded border"></div>
                    <span className="text-sm text-slate-600">Your Path</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Selected: {userPath.length} tiles
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    ⚠️ Obstacles are now hidden!
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-2">
              {gamePhase === GAME_PHASES.PATH_SELECTION && (
                <div className="space-y-2">
                  <button 
                    onClick={checkPath}
                    disabled={userPath.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    {currentLevelData.creature} Send {currentLevelData.creature.includes('🐢') ? 'Turtle' : 'Cat'}!
                  </button>
                  <button 
                    onClick={() => {
                      // Clear user path
                      setUserPath([])
                      const newGrid = [...grid]
                      newGrid.forEach(row => row.forEach(tile => tile.isSelectedByUser = false))
                      setGrid(newGrid)
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    🗑️ Clear Path
                  </button>
                </div>
              )}
              
              {gamePhase === GAME_PHASES.RESULT && (
                <div className="space-y-2">
                  <button 
                    onClick={() => startGame(currentLevel)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    🎮 Try Again
                  </button>
                  
                  {score === 100 && unlockedLevels.includes(currentLevel + 1) && LEVELS[currentLevel + 1] && (
                    <button 
                      onClick={() => startGame(currentLevel + 1)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      🌟 Next Level: {LEVELS[currentLevel + 1].name}
                    </button>
                  )}
                  
                  <button 
                    onClick={showLevelSelect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    🌟 Level Select
                  </button>
                </div>
              )}
              
              {gamePhase !== GAME_PHASES.CREATURE_MOVING && (
                <button 
                  onClick={backToWelcome} 
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  ← Back to Menu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100">
        <div className="absolute inset-0 bg-white/30"></div>
      </div>
      
        {/* Main Content */}
         <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
           <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-md w-full text-center">
            {/* Title Section */}
            <div className="mb-8">
              <div className="text-5xl mb-4">🏘️</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Tile Town
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Save the Creatures
              </p>
            </div>
          
                      {/* Story Section */}
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-700 leading-relaxed">
                An evil wizard has scattered the town's creatures across magical tiles. 
                <span className="font-semibold text-slate-900"> Remember the patterns</span> and bring them home!
              </p>
            </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button onClick={() => startGame(currentLevel)} className="group w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg">
              <span className="flex items-center justify-center gap-2">
                <span className="group-hover:scale-110 transition-transform">🎮</span>
                Continue Level {currentLevel}
              </span>
            </button>
            
            <button onClick={showLevelSelect} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-2">
                <span>🌟</span>
                Select Level
              </span>
            </button>
            
            <button onClick={showInstructions} className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-slate-700 font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              How to Play
            </button>
          </div>

          {/* Level Indicator */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg">{currentLevelData.creature}</span>
              <span className="font-semibold text-slate-800">Level {currentLevel}: {currentLevelData.name}</span>
            </div>
            <div className="text-sm text-slate-600">{currentLevelData.gridSize}×{currentLevelData.gridSize} Grid • Path Memory Challenge</div>
            <div className="text-xs text-blue-600 mt-1">Help the {currentLevelData.creature} find {currentLevelData.goal}! </div>
            
            {/* Scoring Information */}
            <div className="mt-3 pt-2 border-t border-blue-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Score:</span>
                <span className="font-bold text-blue-600">{totalGameScore.toLocaleString()} pts</span>
              </div>
              {perfectStreak > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Perfect Streak:</span>
                  <span className="font-bold text-purple-600">🔥 {perfectStreak}</span>
                </div>
              )}
              <div className="text-xs text-slate-500 mt-1">
                {unlockedLevels.length > 1 && `🎉 ${unlockedLevels.length} levels unlocked!`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
