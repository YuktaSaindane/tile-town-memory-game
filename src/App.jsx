import React, { useState } from 'react'

// Game states
const GAME_STATES = {
  WELCOME: 'welcome',
  PLAYING: 'playing',
  INSTRUCTIONS: 'instructions'
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.WELCOME)
  
  const startGame = () => {
    setGameState(GAME_STATES.PLAYING)
  }
  
  const showInstructions = () => {
    setGameState(GAME_STATES.INSTRUCTIONS)
  }
  
  const backToWelcome = () => {
    setGameState(GAME_STATES.WELCOME)
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
                <p><strong>Study the pattern:</strong> Watch carefully as creatures appear on the grid for a few seconds</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧠</span>
                <p><strong>Remember the layout:</strong> The grid will go blank - remember where each creature was!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🖱️</span>
                <p><strong>Recreate the pattern:</strong> Click tiles to place creatures in the correct positions</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏆</span>
                <p><strong>Complete the level:</strong> Get all creatures home to unlock the next challenge!</p>
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
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-2xl w-full text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">🐸 Froggy's Pond</h2>
              <p className="text-slate-600">Remember the pattern and help Froggy find his lily pad!</p>
            </div>
            
            {/* Placeholder for game grid - we'll build this next */}
            <div className="bg-slate-100 rounded-xl p-8 mb-6">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-slate-600">Game grid coming soon...</p>
            </div>
            
            <button onClick={backToWelcome} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-6 rounded-lg transition-colors">
              ← Back to Menu
            </button>
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
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">🐸</span>
                <span className="font-semibold text-slate-800">Level 1: Froggy's Pond</span>
              </div>
              <div className="text-sm text-slate-600">4×4 Grid • Memory Challenge</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default App
