import React, { useState, useEffect } from 'react'

// Add confetti animation styles
const confettiStyles = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotateZ(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotateZ(720deg);
      opacity: 0;
    }
  }
`

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = confettiStyles
  document.head.appendChild(styleSheet)
}

// Game states
const GAME_STATES = {
  WELCOME: 'welcome',
  PLAYING: 'playing',
  INSTRUCTIONS: 'instructions',
  LEVEL_SELECT: 'level_select'
}

// Level configurations
const LEVELS = {
  1: {
    name: "Turtle's Journey", 
    creature: "🐢",
    goal: "🏝️",
    gridSize: 4,
    start: { x: 0, y: 0 },
    end: { x: 3, y: 3 },
    correctPath: [
      { x: 0, y: 0 }, // start
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 }  // end
    ],
    obstacles: [
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ],
    viewTime: 4000, // 4 seconds to study the path
    selectionTime: 8000, // 8 seconds to select the path
    background: "from-violet-100 via-purple-50 to-indigo-100"
  },
  2: {
    name: "Cat's Adventure",
    creature: "🐱", 
    goal: "🐟",
    gridSize: 5,
    start: { x: 0, y: 0 },
    end: { x: 4, y: 4 },
    correctPath: [
      { x: 0, y: 0 }, // start
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 }  // end
    ],
    obstacles: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 2, y: 4 }
    ],
    viewTime: 5000, // 5 seconds to study (harder level)
    selectionTime: 10000, // 10 seconds to select (more complex)
    background: "from-orange-100 via-amber-50 to-yellow-100"
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
const createInitialGrid = (level) => {
  const grid = []
  for (let y = 0; y < level.gridSize; y++) {
    const row = []
    for (let x = 0; x < level.gridSize; x++) {
      row.push({
        x,
        y,
        isStart: x === level.start.x && y === level.start.y,
        isGoal: x === level.end.x && y === level.end.y,
        isPath: level.correctPath.some(p => p.x === x && p.y === y),
        isSelectedByUser: false,
        isObstacle: level.obstacles.some(o => o.x === x && o.y === y),
        isCreatureHere: x === level.start.x && y === level.start.y // creature starts here
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
  const [grid, setGrid] = useState(createInitialGrid(LEVELS[1]))
  const [timeLeft, setTimeLeft] = useState(LEVELS[1].viewTime / 1000)
  const [selectionTimeLeft, setSelectionTimeLeft] = useState(LEVELS[1].selectionTime / 1000)
  const [score, setScore] = useState(0)
  const [userPath, setUserPath] = useState([]) // Track user's selected path
  const [creaturePosition, setCreaturePosition] = useState(LEVELS[1].start) // For animation
  const [showSuccessEffect, setShowSuccessEffect] = useState(false) // For sparkly success animation
  const [isDrawing, setIsDrawing] = useState(false) // Track if user is actively drawing
  const [drawMode, setDrawMode] = useState('add') // 'add' or 'remove' - what happens when dragging
  
  const currentLevelData = LEVELS[currentLevel]
  
  const startGame = (levelNumber = currentLevel) => {
    const level = LEVELS[levelNumber]
    setCurrentLevel(levelNumber)
    setGameState(GAME_STATES.PLAYING)
    setGamePhase(GAME_PHASES.PATH_PREVIEW)
    setGrid(createInitialGrid(level))
    setTimeLeft(level.viewTime / 1000)
    setSelectionTimeLeft(level.selectionTime / 1000)
    setScore(0)
    setUserPath([])
    setCreaturePosition(level.start)
    setShowSuccessEffect(false)
    setIsDrawing(false)
    setDrawMode('add')
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
    } else if (tile.isObstacle) {
      content = "🪨"
      bgColor = "bg-gray-300"
      borderColor = "border-gray-500"
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
    } else {
      // Empty tile
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
    if (tile.isStart || tile.isGoal || tile.isObstacle) return
    
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
    const correctPath = LEVELS[currentLevel].correctPath
    
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
    
    const percentage = isCorrect ? 100 : Math.round((userPath.length / (correctPath.length - 2)) * 50) // Partial credit
    setScore(percentage)
    
    // Trigger success effect if perfect score
    if (percentage === 100) {
      setShowSuccessEffect(true)
      setTimeout(() => setShowSuccessEffect(false), 3000) // Show for 3 seconds
    }
    
    // Start creature animation along user's path
    setGamePhase(GAME_PHASES.CREATURE_MOVING)
    animateCreature(fullUserPath, isCorrect)
  }
  
  // Animate creature moving along the path
  const animateCreature = (path, isCorrect) => {
    let stepIndex = 0
    const animationInterval = setInterval(() => {
      if (stepIndex < path.length) {
        // Update creature position
        setCreaturePosition(path[stepIndex])
        
        // Update grid to show creature position
        const newGrid = [...grid]
        // Clear creature from all tiles
        newGrid.forEach(row => row.forEach(tile => tile.isCreatureHere = false))
        // Set creature at current position
        if (path[stepIndex]) {
          newGrid[path[stepIndex].y][path[stepIndex].x].isCreatureHere = true
        }
        setGrid(newGrid)
        
        stepIndex++
      } else {
        // Animation complete
        clearInterval(animationInterval)
        
        // Unlock next level if this level was completed perfectly
        if (isCorrect) {
          unlockNextLevel()
        }
        
        setTimeout(() => {
          setGamePhase(GAME_PHASES.RESULT)
        }, 1000) // Wait 1 second before showing result
      }
    }, 800) // Move every 800ms
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
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">🌟 Choose Your Adventure 🌟</h2>
            
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
                      </div>
                      
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
                <p><strong>Remember the route:</strong> The path will disappear - remember every step!</p>
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
        
        {/* Confetti Celebration Effect */}
        {showSuccessEffect && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {/* Massive Confetti Rain */}
            <div className="absolute top-0 left-0 w-full">
              {/* Row 1 - Left side */}
              <div className="absolute top-0 left-[5%] w-3 h-3 bg-red-500" style={{animation: 'confetti-fall 2s linear infinite', animationDelay: '0s'}}></div>
              <div className="absolute top-0 left-[8%] w-2 h-4 bg-blue-500 rounded" style={{animation: 'confetti-fall 2.2s linear infinite', animationDelay: '0.1s'}}></div>
              <div className="absolute top-0 left-[12%] w-4 h-2 bg-yellow-500" style={{animation: 'confetti-fall 1.8s linear infinite', animationDelay: '0.2s'}}></div>
              <div className="absolute top-0 left-[16%] w-3 h-3 bg-green-500 rounded-full" style={{animation: 'confetti-fall 2.1s linear infinite', animationDelay: '0.3s'}}></div>
              <div className="absolute top-0 left-[20%] w-2 h-5 bg-purple-500" style={{animation: 'confetti-fall 1.9s linear infinite', animationDelay: '0.4s'}}></div>
              <div className="absolute top-0 left-[24%] w-4 h-3 bg-pink-500 rounded" style={{animation: 'confetti-fall 2.3s linear infinite', animationDelay: '0.5s'}}></div>
              <div className="absolute top-0 left-[28%] w-3 h-3 bg-orange-500 rounded-full" style={{animation: 'confetti-fall 2s linear infinite', animationDelay: '0.6s'}}></div>
              <div className="absolute top-0 left-[32%] w-2 h-4 bg-cyan-500" style={{animation: 'confetti-fall 1.7s linear infinite', animationDelay: '0.7s'}}></div>
              <div className="absolute top-0 left-[36%] w-4 h-2 bg-lime-500 rounded" style={{animation: 'confetti-fall 2.4s linear infinite', animationDelay: '0.8s'}}></div>
              <div className="absolute top-0 left-[40%] w-3 h-3 bg-indigo-500" style={{animation: 'confetti-fall 2.2s linear infinite', animationDelay: '0.9s'}}></div>
              
              {/* Row 2 - Middle */}
              <div className="absolute top-0 left-[44%] w-2 h-3 bg-rose-500 rounded-full" style={{animation: 'confetti-fall 1.8s linear infinite', animationDelay: '1s'}}></div>
              <div className="absolute top-0 left-[48%] w-4 h-4 bg-emerald-500" style={{animation: 'confetti-fall 2.1s linear infinite', animationDelay: '1.1s'}}></div>
              <div className="absolute top-0 left-[52%] w-3 h-2 bg-amber-500 rounded" style={{animation: 'confetti-fall 1.9s linear infinite', animationDelay: '1.2s'}}></div>
              <div className="absolute top-0 left-[56%] w-2 h-2 bg-teal-500 rounded-full" style={{animation: 'confetti-fall 2.3s linear infinite', animationDelay: '1.3s'}}></div>
              <div className="absolute top-0 left-[60%] w-3 h-4 bg-violet-500" style={{animation: 'confetti-fall 2s linear infinite', animationDelay: '1.4s'}}></div>
              <div className="absolute top-0 left-[64%] w-4 h-3 bg-red-400 rounded" style={{animation: 'confetti-fall 1.8s linear infinite', animationDelay: '1.5s'}}></div>
              <div className="absolute top-0 left-[68%] w-2 h-5 bg-blue-400" style={{animation: 'confetti-fall 2.2s linear infinite', animationDelay: '1.6s'}}></div>
              <div className="absolute top-0 left-[72%] w-3 h-3 bg-green-400 rounded-full" style={{animation: 'confetti-fall 1.7s linear infinite', animationDelay: '1.7s'}}></div>
              <div className="absolute top-0 left-[76%] w-4 h-2 bg-yellow-400 rounded" style={{animation: 'confetti-fall 2.4s linear infinite', animationDelay: '1.8s'}}></div>
              <div className="absolute top-0 left-[80%] w-2 h-4 bg-purple-400" style={{animation: 'confetti-fall 1.9s linear infinite', animationDelay: '1.9s'}}></div>
              
              {/* Row 3 - Right side */}
              <div className="absolute top-0 left-[84%] w-3 h-3 bg-pink-400 rounded-full" style={{animation: 'confetti-fall 2.1s linear infinite', animationDelay: '2s'}}></div>
              <div className="absolute top-0 left-[88%] w-4 h-3 bg-orange-400 rounded" style={{animation: 'confetti-fall 1.8s linear infinite', animationDelay: '2.1s'}}></div>
              <div className="absolute top-0 left-[92%] w-2 h-2 bg-cyan-400 rounded-full" style={{animation: 'confetti-fall 2.3s linear infinite', animationDelay: '2.2s'}}></div>
              <div className="absolute top-0 left-[96%] w-3 h-4 bg-lime-400" style={{animation: 'confetti-fall 2s linear infinite', animationDelay: '2.3s'}}></div>
              
              {/* Additional scattered pieces */}
              <div className="absolute top-0 left-[15%] w-2 h-3 bg-fuchsia-500 rounded" style={{animation: 'confetti-fall 1.6s linear infinite', animationDelay: '0.5s'}}></div>
              <div className="absolute top-0 left-[35%] w-3 h-2 bg-sky-500" style={{animation: 'confetti-fall 2.5s linear infinite', animationDelay: '1.2s'}}></div>
              <div className="absolute top-0 left-[55%] w-4 h-4 bg-red-600 rounded-full" style={{animation: 'confetti-fall 1.9s linear infinite', animationDelay: '0.8s'}}></div>
              <div className="absolute top-0 left-[75%] w-2 h-5 bg-emerald-600" style={{animation: 'confetti-fall 2.1s linear infinite', animationDelay: '1.6s'}}></div>
              <div className="absolute top-0 left-[25%] w-3 h-3 bg-violet-600 rounded" style={{animation: 'confetti-fall 1.7s linear infinite', animationDelay: '0.3s'}}></div>
              <div className="absolute top-0 left-[45%] w-4 h-2 bg-amber-600 rounded-full" style={{animation: 'confetti-fall 2.4s linear infinite', animationDelay: '1.9s'}}></div>
              <div className="absolute top-0 left-[65%] w-2 h-4 bg-rose-600" style={{animation: 'confetti-fall 1.8s linear infinite', animationDelay: '0.7s'}}></div>
              <div className="absolute top-0 left-[85%] w-3 h-3 bg-teal-600 rounded" style={{animation: 'confetti-fall 2.2s linear infinite', animationDelay: '1.4s'}}></div>
            </div>
            
            {/* Celebration Emojis Popping */}
            <div className="absolute top-1/2 left-1/5 text-3xl animate-bounce" style={{animationDelay: '0s'}}>🎉</div>
            <div className="absolute top-2/3 right-1/5 text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>🥳</div>
            <div className="absolute top-1/3 left-1/2 text-3xl animate-bounce" style={{animationDelay: '0.6s'}}>🎊</div>
            <div className="absolute bottom-1/4 left-3/4 text-3xl animate-bounce" style={{animationDelay: '0.9s'}}>🌟</div>
            <div className="absolute top-1/4 right-1/3 text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>🎉</div>
            <div className="absolute bottom-1/3 left-1/4 text-3xl animate-bounce" style={{animationDelay: '0.7s'}}>🎊</div>
          </div>
        )}
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-2xl w-full text-center">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentLevelData.creature} {currentLevelData.name}</h2>
              <p className="text-sm text-slate-500">Level {currentLevel}</p>
              {gamePhase === GAME_PHASES.PATH_PREVIEW && (
                <div>
                  <p className="text-slate-600 mb-2">Study the blue path carefully! The {currentLevelData.creature} needs to reach the {currentLevelData.goal}.</p>
                  <div className="text-3xl font-bold text-blue-600">{timeLeft}s</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.PATH_SELECTION && (
                <div>
                  <p className="text-slate-600 mb-2">Draw the path from memory! Click or drag across tiles.</p>
                  <div className="text-2xl font-bold text-orange-600 mb-2">⏰ {selectionTimeLeft}s</div>
                  <p className="text-sm text-slate-500">💡 Green tiles = your path. Drag to add/remove smoothly!</p>
                </div>
              )}
              {gamePhase === GAME_PHASES.CREATURE_MOVING && (
                <div>
                  <p className="text-slate-600 mb-2">{currentLevelData.creature} The {currentLevelData.creature.includes('🐢') ? 'turtle' : 'cat'} is following your path...</p>
                  <div className="text-lg text-blue-600">Watch carefully!</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.RESULT && (
                <div>
                  <p className="text-slate-600 mb-2">{score === 100 ? "Perfect! 🎉" : "Good try! 👍"}</p>
                  <div className="text-2xl font-bold text-green-600">{score}% correct!</div>
                  {score === 100 ? (
                    <p className="text-sm text-green-600 mt-1">The {currentLevelData.creature.includes('🐢') ? 'turtle' : 'cat'} made it home! {currentLevelData.goal}</p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">The {currentLevelData.creature.includes('🐢') ? 'turtle' : 'cat'} got confused... Try again! 🤔</p>
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
            <div className="text-xs text-slate-500 mt-2">
              {unlockedLevels.length > 1 && `🎉 ${unlockedLevels.length} levels unlocked!`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
