import React, { useState, useEffect } from 'react'

// Game states
const GAME_STATES = {
  WELCOME: 'welcome',
  PLAYING: 'playing',
  INSTRUCTIONS: 'instructions'
}

// Level 1: Turtle's Journey configuration
const LEVEL_1 = {
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
  selectionTime: 8000 // 8 seconds to select the path
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
  const [grid, setGrid] = useState(createInitialGrid(LEVEL_1))
  const [timeLeft, setTimeLeft] = useState(LEVEL_1.viewTime / 1000)
  const [selectionTimeLeft, setSelectionTimeLeft] = useState(LEVEL_1.selectionTime / 1000)
  const [score, setScore] = useState(0)
  const [userPath, setUserPath] = useState([]) // Track user's selected path
  const [creaturePosition, setCreaturePosition] = useState(LEVEL_1.start) // For animation
  const [showSuccessEffect, setShowSuccessEffect] = useState(false) // For sparkly success animation
  
  const startGame = () => {
    setGameState(GAME_STATES.PLAYING)
    setGamePhase(GAME_PHASES.PATH_PREVIEW)
    setGrid(createInitialGrid(LEVEL_1))
    setTimeLeft(LEVEL_1.viewTime / 1000)
    setSelectionTimeLeft(LEVEL_1.selectionTime / 1000)
    setScore(0)
    setUserPath([])
    setCreaturePosition(LEVEL_1.start)
    setShowSuccessEffect(false)
  }
  
  const showInstructions = () => {
    setGameState(GAME_STATES.INSTRUCTIONS)
  }
  
  const backToWelcome = () => {
    setGameState(GAME_STATES.WELCOME)
  }
  
  // Tile component - handles different tile states
  const Tile = ({ tile, onClick, gamePhase }) => {
    const isClickable = gamePhase === GAME_PHASES.PATH_SELECTION && !tile.isStart && !tile.isGoal && !tile.isObstacle
    
    // Determine tile appearance based on state
    let content = ""
    let bgColor = "bg-slate-100"
    let borderColor = "border-slate-300"
    let textColor = "text-slate-600"
    
    // Start and goal always visible
    if (tile.isStart) {
      content = tile.isCreatureHere ? LEVEL_1.creature : "🏁"
      bgColor = "bg-green-100"
      borderColor = "border-green-400"
    } else if (tile.isGoal) {
      content = LEVEL_1.goal
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
        disabled={!isClickable}
        className={`
          w-16 h-16 text-xl rounded-lg border-2 transition-all duration-200
          ${bgColor} ${borderColor} ${textColor}
          ${isClickable 
            ? 'hover:scale-105 hover:shadow-md cursor-pointer' 
            : 'cursor-default'
          }
          flex items-center justify-center font-bold
        `}
      >
        {content}
      </button>
    )
  }
  
  // Grid component
  const Grid = ({ grid, onTileClick, gamePhase }) => (
    <div className="grid grid-cols-4 gap-2 p-4 bg-slate-200 rounded-xl">
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            tile={tile}
            onClick={onTileClick}
            gamePhase={gamePhase}
          />
        ))
      )}
    </div>
  )
  
  // Handle tile clicks during path selection phase
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
  
  // Check if user's path matches the correct path
  const checkPath = () => {
    // Add start and end to user path for comparison
    const fullUserPath = [LEVEL_1.start, ...userPath, LEVEL_1.end]
    const correctPath = LEVEL_1.correctPath
    
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
                <p><strong>Draw the path:</strong> Click tiles to recreate the route from memory</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100">
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        
        {/* Success Effect Overlay */}
        {showSuccessEffect && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-green-200/20 to-blue-200/20 animate-pulse"></div>
            {/* Floating sparkles */}
            <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce" style={{animationDelay: '0s'}}>✨</div>
            <div className="absolute top-1/3 right-1/4 text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🌟</div>
            <div className="absolute bottom-1/3 left-1/3 text-4xl animate-bounce" style={{animationDelay: '0.4s'}}>💫</div>
            <div className="absolute top-1/2 right-1/3 text-3xl animate-bounce" style={{animationDelay: '0.6s'}}>⭐</div>
            <div className="absolute bottom-1/4 right-1/5 text-4xl animate-bounce" style={{animationDelay: '0.8s'}}>✨</div>
            <div className="absolute top-1/5 left-1/2 text-3xl animate-bounce" style={{animationDelay: '1s'}}>🌟</div>
            {/* Success text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl font-bold text-yellow-500 animate-pulse">🎉 PERFECT! 🎉</div>
            </div>
          </div>
        )}
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-2xl w-full text-center">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">🐢 {LEVEL_1.name}</h2>
              {gamePhase === GAME_PHASES.PATH_PREVIEW && (
                <div>
                  <p className="text-slate-600 mb-2">Study the blue path carefully! The turtle needs to reach the island.</p>
                  <div className="text-3xl font-bold text-blue-600">{timeLeft}s</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.PATH_SELECTION && (
                <div>
                  <p className="text-slate-600 mb-2">Click tiles to recreate the path from memory!</p>
                  <div className="text-2xl font-bold text-orange-600 mb-2">⏰ {selectionTimeLeft}s</div>
                  <p className="text-sm text-slate-500">💡 Green tiles = your path. Click again to deselect.</p>
                </div>
              )}
              {gamePhase === GAME_PHASES.CREATURE_MOVING && (
                <div>
                  <p className="text-slate-600 mb-2">🐢 The turtle is following your path...</p>
                  <div className="text-lg text-blue-600">Watch carefully!</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.RESULT && (
                <div>
                  <p className="text-slate-600 mb-2">{score === 100 ? "Perfect! 🎉" : "Good try! 👍"}</p>
                  <div className="text-2xl font-bold text-green-600">{score}% correct!</div>
                  {score === 100 ? (
                    <p className="text-sm text-green-600 mt-1">The turtle made it home! 🏝️</p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">The turtle got confused... Try again! 🤔</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Game Grid */}
            <div className="mb-6 flex justify-center">
              <Grid grid={grid} onTileClick={handleTileClick} gamePhase={gamePhase} />
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
                    <span className="text-lg">🐢</span>
                    <span className="text-sm text-slate-600">Turtle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏝️</span>
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
                    🐢 Send Turtle!
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
                <button 
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  🎮 Try Again
                </button>
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
            <button onClick={startGame} className="group w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg">
              <span className="flex items-center justify-center gap-2">
                <span className="group-hover:scale-110 transition-transform">🎮</span>
                Start Playing
              </span>
            </button>
            
            <button onClick={showInstructions} className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              How to Play
            </button>
          </div>

                      {/* Level Indicator */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">🐢</span>
                <span className="font-semibold text-slate-800">Level 1: {LEVEL_1.name}</span>
              </div>
              <div className="text-sm text-slate-600">4×4 Grid • Path Memory Challenge</div>
              <div className="text-xs text-blue-600 mt-1">Help the turtle find its way home! 🏝️</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default App
