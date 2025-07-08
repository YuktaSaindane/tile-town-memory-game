import React from 'react'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>
      
      {/* Floating Emojis */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🐸</div>
      <div className="absolute top-20 right-20 text-3xl animate-pulse">⭐</div>
      <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-500">🐱</div>
      <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-300">🐝</div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-lg w-full text-center transform hover:scale-105 transition-all duration-300">
          {/* Title Section */}
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-bounce">🏘️</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-3">
              TILE TOWN
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <p className="text-2xl font-bold text-orange-500">
                Save the Creatures!
              </p>
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          
          {/* Story Section */}
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-purple-300">
            <p className="text-gray-700 leading-relaxed font-medium">
              🧙‍♂️ The evil wizard has scattered our cute creatures across magical tiles! 
              <br/>
              <span className="text-purple-600 font-bold">Remember the patterns</span> and 
              <span className="text-green-600 font-bold"> bring them home!</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-black text-xl py-5 px-8 rounded-2xl transform transition-all duration-200 hover:scale-110 hover:shadow-2xl shadow-lg border-4 border-white active:scale-95">
              🎮 START ADVENTURE
            </button>
            
            <button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold text-lg py-4 px-8 rounded-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg border-2 border-white/50">
              📚 How to Play
            </button>
          </div>

          {/* Level Indicator */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-orange-300">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-orange-700">Next Adventure:</span>
              <span className="text-xl">🐸 Froggy's Pond</span>
            </div>
            <div className="text-sm text-orange-600 mt-1">4x4 Grid • Memory Challenge</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
