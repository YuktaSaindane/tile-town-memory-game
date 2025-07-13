import React, { useState, useEffect } from 'react'

// Nature Expedition Sound System
class NatureExpeditionSounds {
  constructor() {
    this.audioContext = null
    this.masterGain = null
    this.isInitialized = false
    this.volume = 0.3 // Pleasant, not overwhelming
  }

  // Initialize audio context when user interacts
  async initialize() {
    if (this.isInitialized) return
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.volume
      this.masterGain.connect(this.audioContext.destination)
      this.isInitialized = true
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }

  // Create natural sound frequencies
  createTone(frequency, duration, type = 'sine', volume = 0.5) {
    if (!this.isInitialized) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    // Natural envelope for pleasant sounds
    const now = this.audioContext.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  // Footstep sounds for different terrains
  footstepOnGrass() {
    // Soft, muffled footstep
    this.createTone(120, 0.15, 'sawtooth', 0.1)
    setTimeout(() => this.createTone(80, 0.1, 'triangle', 0.05), 50)
  }

  footstepOnStone() {
    // Crisp, echoing footstep
    this.createTone(200, 0.2, 'square', 0.15)
    setTimeout(() => this.createTone(150, 0.15, 'sawtooth', 0.08), 30)
  }

  footstepOnSand() {
    // Soft, shifting footstep
    this.createTone(100, 0.25, 'triangle', 0.08)
    setTimeout(() => this.createTone(60, 0.2, 'sine', 0.04), 40)
  }

  footstepOnWood() {
    // Hollow, creaking footstep
    this.createTone(180, 0.18, 'square', 0.12)
    setTimeout(() => this.createTone(90, 0.12, 'triangle', 0.06), 60)
  }

  // Nature ambient sounds
  windThroughTrees() {
    // Gentle wind sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createTone(40 + Math.random() * 20, 1.5 + Math.random(), 'sine', 0.03)
      }, i * 200)
    }
  }

  birdCall() {
    // Pleasant bird chirp
    const frequencies = [800, 1200, 900, 1100]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.1, 'sine', 0.08)
      }, index * 80)
    })
  }

  leavesRustle() {
    // Leaves rustling
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(200 + Math.random() * 100, 0.2, 'sawtooth', 0.02)
      }, i * 40)
    }
  }

  // Expedition equipment sounds
  compassClick() {
    // Gentle compass click
    this.createTone(800, 0.05, 'square', 0.1)
    setTimeout(() => this.createTone(600, 0.03, 'sine', 0.05), 20)
  }

  mapRustle() {
    // Paper map rustling
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createTone(300 + Math.random() * 200, 0.15, 'sawtooth', 0.04)
      }, i * 50)
    }
  }

  backpackShift() {
    // Backpack contents shifting
    this.createTone(120, 0.3, 'triangle', 0.06)
    setTimeout(() => this.createTone(80, 0.2, 'sine', 0.04), 100)
  }

  // Success and discovery sounds
  treasureFound() {
    // Magical discovery chime
    const melody = [523, 659, 784, 1047] // C, E, G, C
    melody.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.5, 'sine', 0.15)
      }, index * 150)
    })
  }

  pathSuccess() {
    // Gentle success melody
    const notes = [440, 554, 659] // A, C#, E
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.3, 'sine', 0.1)
      }, index * 100)
    })
  }

  achievementUnlock() {
    // Triumphant but gentle achievement sound
    const chord = [262, 330, 392, 523] // C Major chord
    chord.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.8, 'sine', 0.08)
      }, index * 50)
    })
  }

  // Gentle failure sounds
  pathMistake() {
    // Disappointed but not harsh
    this.createTone(220, 0.4, 'sine', 0.08)
    setTimeout(() => this.createTone(196, 0.6, 'sine', 0.06), 200)
  }

  obstacleHit() {
    // Gentle bump sound
    this.createTone(150, 0.2, 'triangle', 0.1)
    setTimeout(() => this.createTone(100, 0.3, 'sine', 0.05), 100)
  }

  // Ambient background sounds
  startAmbientNature() {
    // Periodic nature sounds
    const playRandomNatureSound = () => {
      const sounds = [
        () => this.windThroughTrees(),
        () => this.birdCall(),
        () => this.leavesRustle()
      ]
      sounds[Math.floor(Math.random() * sounds.length)]()
    }

    // Play ambient sound every 8-15 seconds
    const scheduleNext = () => {
      setTimeout(() => {
        playRandomNatureSound()
        scheduleNext()
      }, 8000 + Math.random() * 7000)
    }
    scheduleNext()
  }

  // Footstep sequence based on terrain
  playFootstepSequence(terrainType, steps = 1) {
    const stepSounds = {
      grass: () => this.footstepOnGrass(),
      stone: () => this.footstepOnStone(),
      sand: () => this.footstepOnSand(),
      wood: () => this.footstepOnWood()
    }

    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        stepSounds[terrainType]()
      }, i * 300)
    }
  }
}

// Enhanced Nature Expedition Sound System with Themes and Controls
class EnhancedNatureExpeditionSounds extends NatureExpeditionSounds {
  constructor() {
    super()
    this.themes = {
      forest: {
        name: "🌲 Forest Expedition",
        ambientSounds: ['windThroughTrees', 'birdCall', 'leavesRustle'],
        footstepBase: 'grass',
        ambientVolume: 0.04
      },
      mountain: {
        name: "🏔️ Mountain Expedition", 
        ambientSounds: ['windThroughTrees', 'distantEcho', 'rockSlide'],
        footstepBase: 'stone',
        ambientVolume: 0.05
      },
      desert: {
        name: "🏜️ Desert Expedition",
        ambientSounds: ['windDunes', 'distantCoyote', 'sandShift'],
        footstepBase: 'sand',
        ambientVolume: 0.03
      },
      jungle: {
        name: "🌴 Jungle Expedition",
        ambientSounds: ['jungleBirds', 'insectChirp', 'distantMonkey'],
        footstepBase: 'wood',
        ambientVolume: 0.06
      },
      arctic: {
        name: "🧊 Arctic Expedition",
        ambientSounds: ['icyWind', 'snowCrunch', 'distantWolf'],
        footstepBase: 'snow',
        ambientVolume: 0.02
      }
    }
    
    this.currentTheme = 'forest'
    this.volumes = {
      master: 0.3,
      ambient: 0.5,
      footsteps: 0.7,
      effects: 0.8,
      creatures: 0.6,
      ui: 0.4
    }
    
    this.ambientInterval = null
    this.weatherEffects = false
  }

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName
      this.restartAmbientSounds()
    }
  }

  setVolume(category, value) {
    this.volumes[category] = Math.max(0, Math.min(1, value))
    if (category === 'master' && this.masterGain) {
      this.masterGain.gain.value = this.volumes.master
    }
  }

  getVolume(category) {
    return this.volumes[category]
  }

  // Enhanced ambient sounds with themes
  distantEcho() {
    const frequencies = [300, 250, 200]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 2, 'sine', 0.02 * this.volumes.ambient)
      }, index * 800)
    })
  }

  rockSlide() {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.createTone(60 + Math.random() * 40, 0.3, 'sawtooth', 0.015 * this.volumes.ambient)
      }, i * 100)
    }
  }

  windDunes() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.createTone(30 + Math.random() * 15, 3 + Math.random() * 2, 'sine', 0.025 * this.volumes.ambient)
      }, i * 500)
    }
  }

  distantCoyote() {
    const howl = [220, 247, 262, 294, 330, 294, 262]
    howl.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.4, 'sine', 0.03 * this.volumes.ambient)
      }, index * 200)
    })
  }

  sandShift() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.createTone(80 + Math.random() * 60, 0.4, 'sawtooth', 0.01 * this.volumes.ambient)
      }, i * 150)
    }
  }

  jungleBirds() {
    const tropicalCalls = [
      () => this.createTone(1200, 0.1, 'sine', 0.06 * this.volumes.ambient),
      () => this.createTone(800, 0.2, 'sine', 0.05 * this.volumes.ambient),
      () => this.createTone(1500, 0.05, 'sine', 0.04 * this.volumes.ambient)
    ]
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        tropicalCalls[Math.floor(Math.random() * tropicalCalls.length)]()
      }, i * 400)
    }
  }

  insectChirp() {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.createTone(2000 + Math.random() * 1000, 0.1, 'sine', 0.02 * this.volumes.ambient)
      }, i * 100)
    }
  }

  distantMonkey() {
    const calls = [440, 520, 440, 370, 330]
    calls.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.15, 'sawtooth', 0.04 * this.volumes.ambient)
      }, index * 150)
    })
  }

  icyWind() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(25 + Math.random() * 20, 2.5, 'sine', 0.03 * this.volumes.ambient)
      }, i * 600)
    }
  }

  snowCrunch() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.createTone(150 + Math.random() * 100, 0.2, 'sawtooth', 0.02 * this.volumes.ambient)
      }, i * 200)
    }
  }

  distantWolf() {
    const howl = [196, 220, 247, 262, 294, 262, 220]
    howl.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.5, 'sine', 0.035 * this.volumes.ambient)
      }, index * 300)
    })
  }

  // Snow footstep for arctic theme
  footstepOnSnow() {
    this.createTone(90, 0.3, 'triangle', 0.06 * this.volumes.footsteps)
    setTimeout(() => this.createTone(60, 0.2, 'sine', 0.03 * this.volumes.footsteps), 80)
  }

  // Creature-specific sounds
  turtleCall() {
    // Gentle turtle sound
    this.createTone(150, 0.8, 'sine', 0.08 * this.volumes.creatures)
    setTimeout(() => this.createTone(120, 0.6, 'sine', 0.06 * this.volumes.creatures), 400)
  }

  catMeow() {
    // Cat meow
    const meow = [330, 440, 550, 440, 330]
    meow.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.15, 'sine', 0.1 * this.volumes.creatures)
      }, index * 100)
    })
  }

  dragonRoar() {
    // Majestic dragon roar
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createTone(80 + i * 20, 0.8, 'sawtooth', 0.12 * this.volumes.creatures)
      }, i * 200)
    }
  }

  rabbitChirp() {
    // Cute rabbit sound
    this.createTone(800, 0.1, 'sine', 0.08 * this.volumes.creatures)
    setTimeout(() => this.createTone(600, 0.08, 'sine', 0.06 * this.volumes.creatures), 150)
  }

  deerCall() {
    // Gentle deer call
    const call = [220, 247, 262, 294, 262]
    call.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.3, 'sine', 0.09 * this.volumes.creatures)
      }, index * 150)
    })
  }

  // Enhanced ambient system with themes
  restartAmbientSounds() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval)
    }
    this.startThemedAmbientSounds()
  }

  startThemedAmbientSounds() {
    const theme = this.themes[this.currentTheme]
    
    // Layer 1: Base ambient (continuous background)
    const startBaseAmbient = () => {
      const baseSchedule = () => {
        setTimeout(() => {
          this.windThroughTrees()
          baseSchedule()
        }, 8000 + Math.random() * 4000)
      }
      baseSchedule()
    }
    
    // Layer 2: Mid-range environmental sounds
    const startMidAmbient = () => {
      const midSchedule = () => {
        setTimeout(() => {
          const midSounds = theme.ambientSounds.slice(0, 2) // First 2 sounds
          const soundName = midSounds[Math.floor(Math.random() * midSounds.length)]
          if (this[soundName]) {
            this[soundName]()
          }
          midSchedule()
        }, 6000 + Math.random() * 6000)
      }
      midSchedule()
    }
    
    // Layer 3: Distant sounds (sparse, atmospheric)
    const startDistantAmbient = () => {
      const distantSchedule = () => {
        setTimeout(() => {
          const distantSounds = theme.ambientSounds.slice(2) // Remaining sounds
          if (distantSounds.length > 0) {
            const soundName = distantSounds[Math.floor(Math.random() * distantSounds.length)]
            if (this[soundName]) {
              this[soundName]()
            }
          }
          distantSchedule()
        }, 12000 + Math.random() * 8000)
      }
      distantSchedule()
    }
    
    // Layer 4: Subtle micro-sounds (very quiet details)
    const startMicroAmbient = () => {
      const microSchedule = () => {
        setTimeout(() => {
          // Subtle environmental details
          if (Math.random() < 0.3) { // 30% chance
            switch (this.currentTheme) {
              case 'forest':
                this.createTone(1800 + Math.random() * 500, 0.05, 'sine', 0.01 * this.volumes.ambient)
                break
              case 'mountain':
                this.createTone(100 + Math.random() * 50, 0.3, 'sine', 0.005 * this.volumes.ambient)
                break
              case 'desert':
                this.createTone(50 + Math.random() * 30, 0.8, 'sine', 0.008 * this.volumes.ambient)
                break
              case 'jungle':
                this.createTone(2500 + Math.random() * 1000, 0.03, 'sine', 0.015 * this.volumes.ambient)
                break
              case 'arctic':
                this.createTone(20 + Math.random() * 15, 1.5, 'sine', 0.003 * this.volumes.ambient)
                break
            }
          }
          microSchedule()
        }, 3000 + Math.random() * 5000)
      }
      microSchedule()
    }
    
    // Start all layers
    startBaseAmbient()
    startMidAmbient()
    startDistantAmbient()
    startMicroAmbient()
  }

  // Override parent methods with volume control
  createTone(frequency, duration, type = 'sine', volume = 0.5) {
    if (!this.isInitialized) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    // Apply master volume multiplier
    const finalVolume = volume * this.volumes.master
    
    const now = this.audioContext.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(finalVolume, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)
    
    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  // Enhanced footstep sequence with theme support
  playFootstepSequence(terrainType, steps = 1) {
    const theme = this.themes[this.currentTheme]
    const baseType = theme.footstepBase
    
    const stepSounds = {
      grass: () => this.footstepOnGrass(),
      stone: () => this.footstepOnStone(),
      sand: () => this.footstepOnSand(),
      wood: () => this.footstepOnWood(),
      snow: () => this.footstepOnSnow()
    }

    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        const adjustedVolume = this.volumes.footsteps
        if (stepSounds[baseType]) {
          stepSounds[baseType]()
        }
      }, i * 300)
    }
  }

  // Override methods to include volume control
  footstepOnGrass() {
    this.createTone(120, 0.15, 'sawtooth', 0.1 * this.volumes.footsteps)
    setTimeout(() => this.createTone(80, 0.1, 'triangle', 0.05 * this.volumes.footsteps), 50)
  }

  footstepOnStone() {
    this.createTone(200, 0.2, 'square', 0.15 * this.volumes.footsteps)
    setTimeout(() => this.createTone(150, 0.15, 'sawtooth', 0.08 * this.volumes.footsteps), 30)
  }

  footstepOnSand() {
    this.createTone(100, 0.25, 'triangle', 0.08 * this.volumes.footsteps)
    setTimeout(() => this.createTone(60, 0.2, 'sine', 0.04 * this.volumes.footsteps), 40)
  }

  footstepOnWood() {
    this.createTone(180, 0.18, 'square', 0.12 * this.volumes.footsteps)
    setTimeout(() => this.createTone(90, 0.12, 'triangle', 0.06 * this.volumes.footsteps), 60)
  }

  windThroughTrees() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createTone(40 + Math.random() * 20, 1.5 + Math.random(), 'sine', 0.03 * this.volumes.ambient)
      }, i * 200)
    }
  }

  birdCall() {
    const frequencies = [800, 1200, 900, 1100]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.1, 'sine', 0.08 * this.volumes.ambient)
      }, index * 80)
    })
  }

  leavesRustle() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(200 + Math.random() * 100, 0.2, 'sawtooth', 0.02 * this.volumes.ambient)
      }, i * 40)
    }
  }

  // Enhanced UI sounds
  compassClick() {
    this.createTone(800, 0.05, 'square', 0.1 * this.volumes.ui)
    setTimeout(() => this.createTone(600, 0.03, 'sine', 0.05 * this.volumes.ui), 20)
  }

  mapRustle() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createTone(300 + Math.random() * 200, 0.15, 'sawtooth', 0.04 * this.volumes.ui)
      }, i * 50)
    }
  }

  backpackShift() {
    this.createTone(120, 0.3, 'triangle', 0.06 * this.volumes.ui)
    setTimeout(() => this.createTone(80, 0.2, 'sine', 0.04 * this.volumes.ui), 100)
  }

  // Enhanced success sounds
  treasureFound() {
    const melody = [523, 659, 784, 1047] // C, E, G, C
    melody.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.5, 'sine', 0.15 * this.volumes.effects)
      }, index * 150)
    })
  }

  pathSuccess() {
    const notes = [440, 554, 659] // A, C#, E
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.3, 'sine', 0.1 * this.volumes.effects)
      }, index * 100)
    })
  }

  achievementUnlock() {
    const chord = [262, 330, 392, 523] // C Major chord
    chord.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.8, 'sine', 0.08 * this.volumes.effects)
      }, index * 50)
    })
  }

  pathMistake() {
    this.createTone(220, 0.4, 'sine', 0.08 * this.volumes.effects)
    setTimeout(() => this.createTone(196, 0.6, 'sine', 0.06 * this.volumes.effects), 200)
  }

  obstacleHit() {
    this.createTone(150, 0.2, 'triangle', 0.1 * this.volumes.effects)
    setTimeout(() => this.createTone(100, 0.3, 'sine', 0.05 * this.volumes.effects), 100)
  }

  // Save/load preferences
  savePreferences() {
    const prefs = {
      theme: this.currentTheme,
      volumes: this.volumes,
      weatherEffects: this.weatherEffects
    }
    localStorage.setItem('expeditionSoundPreferences', JSON.stringify(prefs))
  }

  loadPreferences() {
    const saved = localStorage.getItem('expeditionSoundPreferences')
    if (saved) {
      try {
        const prefs = JSON.parse(saved)
        this.currentTheme = prefs.theme || 'forest'
        this.volumes = { ...this.volumes, ...prefs.volumes }
        this.weatherEffects = prefs.weatherEffects || false
        
        if (this.masterGain) {
          this.masterGain.gain.value = this.volumes.master
        }
      } catch (e) {
        console.warn('Could not load sound preferences:', e)
      }
    }
  }
}

// Global enhanced sound system instance
let natureSounds = new EnhancedNatureExpeditionSounds()

// Helper function to ensure audio is initialized
const ensureAudioInitialized = async () => {
  if (!natureSounds.isInitialized) {
    await natureSounds.initialize()
    natureSounds.loadPreferences()
  }
}

// Achievement System
const ACHIEVEMENTS = {
  FIRST_STEPS: {
    id: 'first_steps',
    title: 'First Expedition',
    description: 'Complete your first expedition successfully',
    icon: '🗺️',
    unlock: (stats) => stats.levelsCompleted >= 1
  },
  PERFECT_NAVIGATOR: {
    id: 'perfect_navigator',
    title: 'Perfect Navigator',
    description: 'Guide a creature flawlessly through treacherous terrain',
    icon: '🧭',
    unlock: (stats) => stats.perfectCompletions >= 1
  },
  SPEED_EXPLORER: {
    id: 'speed_explorer',
    title: 'Speed Explorer',
    description: 'Complete a rescue mission in under 3 seconds',
    icon: '⚡',
    unlock: (stats) => stats.fastestTime > 0 && stats.fastestTime < 3
  },
  EXPEDITION_MASTER: {
    id: 'expedition_master',
    title: 'Expedition Master',
    description: 'Lead 3 consecutive flawless rescue missions',
    icon: '🔥',
    unlock: (stats) => stats.maxStreak >= 3
  },
  SUPPLY_GATHERER: {
    id: 'supply_gatherer',
    title: 'Supply Gatherer',
    description: 'Collect 10 expedition supplies during your adventures',
    icon: '🎒',
    unlock: (stats) => stats.totalPowerUpsEarned >= 10
  },
  DANGER_SCOUT: {
    id: 'danger_scout',
    title: 'Danger Scout',
    description: 'Navigate 5 expeditions without hitting any traps',
    icon: '🛡️',
    unlock: (stats) => stats.cleanCompletions >= 5
  },
  LEGENDARY_EXPLORER: {
    id: 'legendary_explorer',
    title: 'Legendary Explorer',
    description: 'Unlock all 5 expedition territories',
    icon: '🏆',
    unlock: (stats) => stats.levelsUnlocked >= 5
  },
  GRAND_ADVENTURER: {
    id: 'grand_adventurer',
    title: 'Grand Adventurer',
    description: 'Achieve Master Explorer status across all territories',
    icon: '👑',
    unlock: (stats) => stats.isMaster
  },
  TREASURE_HUNTER: {
    id: 'treasure_hunter',
    title: 'Treasure Hunter',
    description: 'Accumulate 50,000 expedition points',
    icon: '💎',
    unlock: (stats) => stats.totalScore >= 50000
  },
  BEAST_WHISPERER: {
    id: 'beast_whisperer',
    title: 'Beast Whisperer',
    description: 'Successfully guide all 5 different creatures to safety',
    icon: '🌟',
    unlock: (stats) => stats.creaturesHelped >= 5
  }
}

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
  
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes achievement-popup {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) rotate(-5deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
  
  .sparkle {
    animation: sparkle-rise 1.5s ease-out infinite;
    animation-delay: var(--delay);
  }
  
  .success-glow {
    animation: gentle-glow 1s ease-in-out infinite;
  }
  
  .confetti {
    animation: confetti-fall 3s linear infinite;
    animation-delay: var(--delay);
  }
  
  .achievement-popup {
    animation: achievement-popup 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
  LEVEL_SELECT: 'level_select',
  ACHIEVEMENTS: 'achievements'
}

// Level configurations with multiple path variations
const LEVELS = {
  1: {
    name: "Turtle's Island Quest", 
    creature: "🐢",
    goal: "🏝️",
    gridSize: 4,
    start: { x: 0, y: 0 },
    end: { x: 3, y: 3 },
    pathVariations: [
      {
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
          { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }
        ],
        obstacles: [
          { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }
        ]
      },
      {
        correctPath: [
          { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 },
          { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
        ],
        obstacles: [
          { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }
        ]
      },
      {
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 },
          { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }
        ],
        obstacles: [
          { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }
        ]
      }
    ],
    viewTime: 4000,
    selectionTime: 8000,
    background: "from-violet-100 via-purple-50 to-indigo-100"
  },
  2: {
    name: "Cat's Fishing Expedition",
    creature: "🐱", 
    goal: "🐟",
    gridSize: 5,
    start: { x: 0, y: 0 },
    end: { x: 4, y: 4 },
    pathVariations: [
      {
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
          { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 },
          { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
          { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 4 },
          { x: 3, y: 4 }, { x: 4, y: 4 }
        ],
        obstacles: [
          { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
          { x: 1, y: 3 }, { x: 1, y: 4 }
        ]
      }
    ],
    viewTime: 3500,
    selectionTime: 7000,
    background: "from-red-100 via-orange-50 to-yellow-100"
  },
  3: {
    name: "Dragon's Treasure Hunt",
    creature: "🐉", 
    goal: "💎",
    gridSize: 6,
    start: { x: 0, y: 5 },
    end: { x: 5, y: 0 },
    pathVariations: [
      {
        correctPath: [
          { x: 0, y: 5 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 3 },
          { x: 3, y: 3 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 1 },
          { x: 5, y: 0 }
        ],
        obstacles: [
          { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
          { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
          { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
          { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }
        ]
      }
    ],
    viewTime: 3000,
    selectionTime: 8000,
    background: "from-purple-100 via-pink-50 to-red-100"
  },
  4: {
    name: "Rabbit's Carrot Expedition",
    creature: "🐰", 
    goal: "🥕",
    gridSize: 7,
    start: { x: 0, y: 0 },
    end: { x: 6, y: 6 },
    pathVariations: [
      {
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 4 },
          { x: 3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 6, y: 4 },
          { x: 5, y: 5 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }
        ],
        obstacles: [
          { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
          { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }
        ]
      }
    ],
    viewTime: 2500,
    selectionTime: 10000,
    background: "from-green-100 via-emerald-50 to-teal-100"
  },
  5: {
    name: "Deer's Mystical Forest Journey",
    creature: "🦌", 
    goal: "🌺",
    gridSize: 8,
    start: { x: 0, y: 0 },
    end: { x: 7, y: 7 },
    pathVariations: [
      {
        correctPath: [
          { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 }
        ],
        obstacles: [
          { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
          { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }
        ]
      }
    ],
    viewTime: 2000,
    selectionTime: 12000,
    background: "from-emerald-100 via-green-50 to-lime-100"
  }
}

// Helper function to hide the path preview
const hidePathInGrid = (grid) => {
  return grid.map(row => 
    row.map(tile => ({
      ...tile,
      isPath: false
    }))
  )
}

// Game phases within playing state  
const GAME_PHASES = {
  PATH_PREVIEW: 'path_preview',
  PATH_SELECTION: 'path_selection',
  CREATURE_MOVING: 'creature_moving',
  RESULT: 'result'
}

// Helper function to create initial grid
const createInitialGrid = (level, pathVariation = null) => {
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
        isCreatureHere: x === level.start.x && y === level.start.y,
        isTrail: false,
        trailAge: 0
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
  const [unlockedLevels, setUnlockedLevels] = useState([1])
  const [grid, setGrid] = useState(() => createInitialGrid(LEVELS[1]))
  const [timeLeft, setTimeLeft] = useState(LEVELS[1].viewTime / 1000)
  const [selectionTimeLeft, setSelectionTimeLeft] = useState(LEVELS[1].selectionTime / 1000)
  const [score, setScore] = useState(0)
  const [userPath, setUserPath] = useState([])
  const [creaturePosition, setCreaturePosition] = useState(LEVELS[1].start)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState('add')
  const [showSparkles, setShowSparkles] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  
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
  
  // Master completion tracking
  const [isMasterComplete, setIsMasterComplete] = useState(() => {
    const saved = localStorage.getItem('tileTownMasterComplete')
    return saved ? JSON.parse(saved) : false
  })

  // Achievement system
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('tileTownAchievements')
    return saved ? JSON.parse(saved) : []
  })
  
  const [gameStats, setGameStats] = useState(() => {
    const saved = localStorage.getItem('tileTownGameStats')
    return saved ? JSON.parse(saved) : {
      levelsCompleted: 0,
      perfectCompletions: 0,
      fastestTime: 0,
      maxStreak: 0,
      totalPowerUpsEarned: 0,
      cleanCompletions: 0,
      levelsUnlocked: 1,
      isMaster: false,
      totalScore: 0,
      creaturesHelped: 0
    }
  })

  const [newAchievements, setNewAchievements] = useState([])
  
  // Power-up system
  const [powerUps, setPowerUps] = useState(() => {
    const saved = localStorage.getItem('tileTownPowerUps')
    return saved ? JSON.parse(saved) : { extraTime: 0, revealHint: 0, obstacleScan: 0 }
  })
  const [activePowerUps, setActivePowerUps] = useState({
    extraTime: false,
    revealHint: false,
    obstacleScan: false
  })
  
  // Sound Control Panel State
  const [showSoundPanel, setShowSoundPanel] = useState(false)
  const [soundTheme, setSoundTheme] = useState('forest')
  const [soundVolumes, setSoundVolumes] = useState({
    master: 0.3,
    ambient: 0.5,
    footsteps: 0.7,
    effects: 0.8,
    creatures: 0.6,
    ui: 0.4
  })
  
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
    const baseScore = Math.round(accuracy * 1000)
    
    const timeRatio = 1 - (timeUsed / maxTime)
    const speedBonus = Math.round(timeRatio * 500)
    
    const perfectBonus = isPerfect ? 300 : 0
    
    const comboMultiplier = 1 + (perfectStreak * 0.2)
    
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
  
  // Achievement system functions
  const updateGameStats = (newStats) => {
    const updatedStats = { ...gameStats, ...newStats }
    setGameStats(updatedStats)
    localStorage.setItem('tileTownGameStats', JSON.stringify(updatedStats))
    checkAchievements(updatedStats)
  }

  const checkAchievements = (stats) => {
    const newlyUnlocked = []
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!achievements.includes(achievement.id) && achievement.unlock(stats)) {
        newlyUnlocked.push(achievement)
      }
    })
    
    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...achievements, ...newlyUnlocked.map(a => a.id)]
      setAchievements(updatedAchievements)
      localStorage.setItem('tileTownAchievements', JSON.stringify(updatedAchievements))
      
      // Show achievement notifications
      setNewAchievements(newlyUnlocked)
      setTimeout(() => setNewAchievements([]), 4000)
      
      // Play achievement unlock sound
      ensureAudioInitialized().then(() => {
        natureSounds.achievementUnlock()
      })
    }
  }

  // Power-up system functions
  const savePowerUps = (newPowerUps) => {
    setPowerUps(newPowerUps)
    localStorage.setItem('tileTownPowerUps', JSON.stringify(newPowerUps))
  }

  const awardPowerUps = (score, isPerfect, timeUsed) => {
    const newPowerUps = { ...powerUps }
    
    if (isPerfect) {
      newPowerUps.extraTime += 1
      if (score > 1500) newPowerUps.revealHint += 1
    }
    
    const maxTime = currentLevelData.selectionTime / 1000
    if (timeUsed < maxTime / 2) {
      newPowerUps.obstacleScan += 1
    }
    
    if (perfectStreak >= 2) {
      newPowerUps.revealHint += 1
    }
    
    savePowerUps(newPowerUps)
  }

  const usePowerUp = (type) => {
    if (powerUps[type] <= 0) return false
    
    const newPowerUps = { ...powerUps }
    newPowerUps[type] -= 1
    savePowerUps(newPowerUps)
    
    setActivePowerUps(prev => ({ ...prev, [type]: true }))
    
    // Apply power-up effects
    switch (type) {
      case 'extraTime':
        setSelectionTimeLeft(prev => prev + 5)
        // Play backpack shifting sound
        ensureAudioInitialized().then(() => {
          natureSounds.backpackShift()
        })
        break
      case 'revealHint':
        revealHintTiles()
        // Play map rustling sound
        ensureAudioInitialized().then(() => {
          natureSounds.mapRustle()
        })
        break
      case 'obstacleScan':
        revealObstacles()
        // Play compass click sound
        ensureAudioInitialized().then(() => {
          natureSounds.compassClick()
        })
        break
    }
    
    return true
  }

  const revealHintTiles = () => {
    const correctPath = getCurrentPath()
    const intermediateTiles = correctPath.slice(1, -1)
    const hintTiles = intermediateTiles.slice(0, 3)
    
    const newGrid = [...grid]
    hintTiles.forEach(tile => {
      const gridTile = newGrid[tile.y][tile.x]
      gridTile.isHintRevealed = true
    })
    setGrid(newGrid)
    
    setTimeout(() => {
      const clearedGrid = [...grid]
      clearedGrid.forEach(row => row.forEach(tile => tile.isHintRevealed = false))
      setGrid(clearedGrid)
      setActivePowerUps(prev => ({ ...prev, revealHint: false }))
    }, 2000)
  }

  const revealObstacles = () => {
    const newGrid = [...grid]
    newGrid.forEach(row => row.forEach(tile => {
      if (tile.isObstacle) {
        tile.isObstacleRevealed = true
      }
    }))
    setGrid(newGrid)
    
    setTimeout(() => {
      const clearedGrid = [...grid]
      clearedGrid.forEach(row => row.forEach(tile => tile.isObstacleRevealed = false))
      setGrid(clearedGrid)
      setActivePowerUps(prev => ({ ...prev, obstacleScan: false }))
    }, 3000)
  }

  const startGame = (levelNumber = currentLevel) => {
    const level = LEVELS[levelNumber]
    
    const selectedVariation = selectRandomPathVariation(levelNumber)
    setCurrentPathVariation(selectedVariation)
    
    setCurrentLevel(levelNumber)
    setGameState(GAME_STATES.PLAYING)
    setGamePhase(GAME_PHASES.PATH_PREVIEW)
    
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
    
    setDetailedScore({
      baseScore: 0,
      speedBonus: 0,
      perfectBonus: 0,
      comboMultiplier: 1 + (perfectStreak * 0.2),
      totalScore: 0
    })
    setLevelStartTime(Date.now())
    
    // Initialize nature sounds and start ambient background
    ensureAudioInitialized().then(() => {
      natureSounds.startAmbientNature()
      
      // Play creature introduction sound
      setTimeout(() => {
        const creatureSounds = {
          '🐢': 'turtleCall',
          '🐱': 'catMeow', 
          '🐉': 'dragonRoar',
          '🐰': 'rabbitChirp',
          '🦌': 'deerCall'
        }
        
        const creatureSound = creatureSounds[level.creature]
        if (creatureSound && natureSounds[creatureSound]) {
          natureSounds[creatureSound]()
        }
      }, 500) // Slight delay to let the level load
    })
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

  const showAchievements = () => {
    setGameState(GAME_STATES.ACHIEVEMENTS)
  }
  
  const unlockNextLevel = () => {
    const nextLevel = currentLevel + 1
    if (LEVELS[nextLevel] && !unlockedLevels.includes(nextLevel)) {
      const newUnlockedLevels = [...unlockedLevels, nextLevel]
      setUnlockedLevels(newUnlockedLevels)
      
      // Play new territory unlock sound
      ensureAudioInitialized().then(() => {
        setTimeout(() => {
          natureSounds.achievementUnlock()
          
          // Play a fanfare for unlocking new territory
          setTimeout(() => {
            const fanfare = [523, 659, 784, 1047, 1319] // C, E, G, C, E
            fanfare.forEach((freq, index) => {
              setTimeout(() => {
                natureSounds.createTone(freq, 0.4, 'sine', 0.1)
              }, index * 120)
            })
          }, 500)
        }, 200)
      })
      
      if (newUnlockedLevels.length >= 5 && !isMasterComplete) {
        setIsMasterComplete(true)
        localStorage.setItem('tileTownMasterComplete', 'true')
        
        // Play master completion celebration
        ensureAudioInitialized().then(() => {
          setTimeout(() => {
            // Epic master completion sound sequence
            const masterFanfare = [262, 330, 392, 523, 659, 784, 1047]
            masterFanfare.forEach((freq, index) => {
              setTimeout(() => {
                natureSounds.createTone(freq, 0.6, 'sine', 0.12)
              }, index * 150)
            })
          }, 1000)
        })
      }
    }
  }
  
  // Sound Control Functions
  const toggleSoundPanel = () => {
    setShowSoundPanel(!showSoundPanel)
  }
  
  const changeSoundTheme = (theme) => {
    setSoundTheme(theme)
    ensureAudioInitialized().then(() => {
      natureSounds.setTheme(theme)
      natureSounds.savePreferences()
    })
  }
  
  const adjustVolume = (category, value) => {
    const newVolumes = { ...soundVolumes, [category]: value }
    setSoundVolumes(newVolumes)
    ensureAudioInitialized().then(() => {
      natureSounds.setVolume(category, value)
      natureSounds.savePreferences()
    })
  }
  
  const testSound = (soundType) => {
    ensureAudioInitialized().then(() => {
      switch (soundType) {
        case 'footsteps':
          natureSounds.playFootstepSequence('grass', 1)
          break
        case 'creatures':
          const creatures = ['turtleCall', 'catMeow', 'dragonRoar', 'rabbitChirp', 'deerCall']
          const randomCreature = creatures[Math.floor(Math.random() * creatures.length)]
          natureSounds[randomCreature]()
          break
        case 'ambient':
          natureSounds.birdCall()
          break
        case 'ui':
          natureSounds.compassClick()
          break
        case 'effects':
          natureSounds.pathSuccess()
          break
        case 'master':
          natureSounds.treasureFound()
          break
        default:
          natureSounds.compassClick()
      }
    })
  }
  
  // Sound Control Panel Component
  const SoundControlPanel = () => {
    if (!showSoundPanel) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">🎵 Sound Control</h2>
              <button
                onClick={toggleSoundPanel}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Theme Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Expedition Theme</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(natureSounds.themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => changeSoundTheme(key)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      soundTheme === key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Volume Controls */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Volume Controls</h3>
              <div className="space-y-4">
                {Object.entries(soundVolumes).map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-600 capitalize min-w-20">
                        {category}:
                      </span>
                      <button
                        onClick={() => testSound(category)}
                        className="text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded transition-colors"
                      >
                        Test
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={value}
                        onChange={(e) => adjustVolume(category, parseFloat(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-xs text-slate-500 min-w-8">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sound Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-700 mb-2">🌲 Current Theme: {natureSounds.themes[soundTheme].name}</h4>
              <p className="text-sm text-slate-600 mb-3">
                Experience immersive nature sounds that change based on your expedition theme. 
                Each theme features unique ambient sounds and terrain-appropriate footsteps.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p><strong>Master:</strong> Overall volume control</p>
                <p><strong>Ambient:</strong> Background nature sounds</p>
                <p><strong>Footsteps:</strong> Terrain-based walking sounds</p>
                <p><strong>Creatures:</strong> Animal calls and sounds</p>
                <p><strong>Effects:</strong> Success and discovery sounds</p>
                <p><strong>UI:</strong> Interface interaction sounds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Tile component
  const Tile = ({ tile, onClick, onMouseDown, onMouseEnter, onMouseUp, gamePhase }) => {
    const isClickable = gamePhase === GAME_PHASES.PATH_SELECTION && !tile.isStart && !tile.isGoal && !tile.isObstacle
    
    let content = ""
    let bgColor = "bg-slate-100"
    let borderColor = "border-slate-300"
    let textColor = "text-slate-600"
    
    if (tile.isStart) {
      content = tile.isCreatureHere ? LEVELS[currentLevel].creature : "🏁"
      bgColor = "bg-green-100"
      borderColor = "border-green-400"
    } else if (tile.isGoal) {
      content = LEVELS[currentLevel].goal
      bgColor = "bg-blue-100" 
      borderColor = "border-blue-400"
    } else if (tile.isObstacle && gamePhase !== GAME_PHASES.PATH_SELECTION) {
      content = "🪨"
      bgColor = "bg-gray-300"
      borderColor = "border-gray-500"
    } else if (tile.isHiddenObstacleHit) {
      content = "❌"
      bgColor = "bg-red-400"
      borderColor = "border-red-600"
    } else if (tile.isObstacleRevealed && !tile.isStart && !tile.isGoal) {
      content = "🚫"
      bgColor = "bg-red-300"
      borderColor = "border-red-500"
    } else if (tile.isHintRevealed && !tile.isStart && !tile.isGoal) {
      content = "💡"
      bgColor = "bg-yellow-300"
      borderColor = "border-yellow-500"
    } else if (gamePhase === GAME_PHASES.PATH_PREVIEW && tile.isPath && !tile.isStart && !tile.isGoal) {
      bgColor = "bg-blue-400"
      borderColor = "border-blue-600"
      content = "🟦"
    } else if (tile.isSelectedByUser) {
      bgColor = "bg-green-400"
      borderColor = "border-green-600"  
      content = "🟩"
    } else if (tile.isTrail) {
      bgColor = "bg-blue-200"
      borderColor = "border-blue-300"
      content = "✨"
    } else {
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
  
  const handleTileClick = (x, y) => {
    if (gamePhase !== GAME_PHASES.PATH_SELECTION) return
    
    const newGrid = [...grid]
    const tile = newGrid[y][x]
    
    if (tile.isStart || tile.isGoal || tile.isObstacle) {
      if (tile.isObstacle) {
        tile.isHiddenObstacleHit = true
        setGrid([...newGrid])
        setTimeout(() => {
          tile.isHiddenObstacleHit = false
          setGrid([...newGrid])
        }, 300)
        // Play obstacle hit sound
        ensureAudioInitialized().then(() => {
          natureSounds.obstacleHit()
        })
      }
      return
    }
    
    const wasSelected = tile.isSelectedByUser
    tile.isSelectedByUser = !tile.isSelectedByUser
    
    const pathCoord = { x, y }
    if (tile.isSelectedByUser) {
      if (!userPath.some(p => p.x === x && p.y === y)) {
        setUserPath([...userPath, pathCoord])
      }
    } else {
      setUserPath(userPath.filter(p => !(p.x === x && p.y === y)))
    }
    
    // Play gentle compass click for path selection
    ensureAudioInitialized().then(() => {
      natureSounds.compassClick()
    })
    
    setGrid(newGrid)
  }

  const handleTileMouseDown = (x, y) => {
    if (gamePhase !== GAME_PHASES.PATH_SELECTION) return
    
    const tile = grid[y][x]
    if (tile.isStart || tile.isGoal || tile.isObstacle) return
    
    setIsDrawing(true)
    setDrawMode(tile.isSelectedByUser ? 'remove' : 'add')
    
    handleTileAction(x, y)
  }

  const handleTileMouseEnter = (x, y) => {
    if (!isDrawing || gamePhase !== GAME_PHASES.PATH_SELECTION) return
    
    const tile = grid[y][x]
    if (tile.isStart || tile.isGoal || tile.isObstacle) return
    
    handleTileAction(x, y)
  }

  const handleTileMouseUp = () => {
    setIsDrawing(false)
  }

  const handleTileAction = (x, y) => {
    const newGrid = [...grid]
    const tile = newGrid[y][x]
    const pathCoord = { x, y }
    
    if (drawMode === 'add' && !tile.isSelectedByUser) {
      tile.isSelectedByUser = true
      if (!userPath.some(p => p.x === x && p.y === y)) {
        setUserPath(prev => [...prev, pathCoord])
      }
    } else if (drawMode === 'remove' && tile.isSelectedByUser) {
      tile.isSelectedByUser = false
      setUserPath(prev => prev.filter(p => !(p.x === x && p.y === y)))
    }
    
    setGrid(newGrid)
  }
  
  const checkPath = () => {
    const correctPath = getCurrentPath()
    
    const correctIntermediateTiles = correctPath.slice(1, -1)
    
    const userHasCorrectTiles = correctIntermediateTiles.length === userPath.length &&
      correctIntermediateTiles.every(correctTile => 
        userPath.some(userTile => userTile.x === correctTile.x && userTile.y === correctTile.y)
      )
    
    const fullUserPath = userHasCorrectTiles ? correctPath : [LEVELS[currentLevel].start, ...userPath, LEVELS[currentLevel].end]
    
    const isCorrect = userHasCorrectTiles
    
    const accuracy = isCorrect ? 1.0 : Math.min(userPath.length / correctIntermediateTiles.length, 1.0)
    const timeUsed = (currentLevelData.selectionTime / 1000) - selectionTimeLeft
    const isPerfect = isCorrect
    
    const newScore = calculateScore(accuracy, timeUsed, isPerfect)
    setDetailedScore(newScore)
    setScore(Math.round(accuracy * 100))
    
    if (isPerfect) {
      setPerfectStreak(prev => {
        const newStreak = prev + 1
        return newStreak
      })
      setShowSparkles(true)
      setShowConfetti(true)
      setTimeout(() => {
        setShowSparkles(false)
        setShowConfetti(false)
      }, 4000)
      
      // Play success sound
      ensureAudioInitialized().then(() => {
        natureSounds.pathSuccess()
        
        // Enhanced streak celebration based on streak length
        if (perfectStreak > 0) {
          const streakCount = perfectStreak + 1
          setTimeout(() => {
            if (streakCount === 2) {
              // Double success - harmony
              setTimeout(() => natureSounds.createTone(523, 0.3, 'sine', 0.08), 0)
              setTimeout(() => natureSounds.createTone(659, 0.3, 'sine', 0.08), 100)
            } else if (streakCount === 3) {
              // Triple success - chord
              setTimeout(() => natureSounds.createTone(440, 0.4, 'sine', 0.08), 0)
              setTimeout(() => natureSounds.createTone(554, 0.4, 'sine', 0.08), 80)
              setTimeout(() => natureSounds.createTone(659, 0.4, 'sine', 0.08), 160)
            } else if (streakCount >= 4) {
              // Epic streak - ascending melody
              const epicMelody = [440, 494, 554, 587, 659, 740, 831]
              epicMelody.slice(0, Math.min(streakCount, 7)).forEach((freq, index) => {
                setTimeout(() => {
                  natureSounds.createTone(freq, 0.25, 'sine', 0.09)
                }, index * 100)
              })
            }
          }, 300)
        }
      })
    } else {
      setPerfectStreak(0)
      
      // Play gentle failure sound
      ensureAudioInitialized().then(() => {
        natureSounds.pathMistake()
      })
    }
    
    saveHighScore(currentLevel, newScore.totalScore)
    updateTotalScore(newScore.totalScore)
    
    awardPowerUps(newScore.totalScore, isPerfect, timeUsed)
    
    const statsUpdate = {
      levelsCompleted: gameStats.levelsCompleted + 1,
      totalScore: gameStats.totalScore + newScore.totalScore,
      levelsUnlocked: Math.max(gameStats.levelsUnlocked, unlockedLevels.length),
      isMaster: isMasterComplete,
      creaturesHelped: gameStats.creaturesHelped + (isPerfect ? 1 : 0)
    }
    
    if (isPerfect) {
      statsUpdate.perfectCompletions = gameStats.perfectCompletions + 1
      statsUpdate.maxStreak = Math.max(gameStats.maxStreak, perfectStreak + 1)
      if (timeUsed < 3) {
        statsUpdate.fastestTime = gameStats.fastestTime === 0 ? timeUsed : Math.min(gameStats.fastestTime, timeUsed)
      }
    }
    
    updateGameStats(statsUpdate)
    
    setGamePhase(GAME_PHASES.CREATURE_MOVING)
    animateCreature(fullUserPath, isCorrect)
  }
  
  const animateCreature = (path, isCorrect) => {
    let stepIndex = 0
    const totalSteps = path.length
    
    const animationInterval = setInterval(() => {
      if (stepIndex < path.length) {
        setAnimationProgress(Math.round((stepIndex / totalSteps) * 100))
        
        setCreaturePosition(path[stepIndex])
        
        const newGrid = [...grid]
        newGrid.forEach(row => row.forEach(tile => {
          tile.isCreatureHere = false
          if (tile.trailAge > 3) {
            tile.isTrail = false
            tile.trailAge = 0
          } else if (tile.isTrail) {
            tile.trailAge = (tile.trailAge || 0) + 1
          }
        }))
        
        if (path[stepIndex]) {
          const currentTile = newGrid[path[stepIndex].y][path[stepIndex].x]
          currentTile.isCreatureHere = true
          
          if (stepIndex > 0 && path[stepIndex - 1]) {
            const prevTile = newGrid[path[stepIndex - 1].y][path[stepIndex - 1].x]
            if (!prevTile.isStart && !prevTile.isGoal) {
              prevTile.isTrail = true
              prevTile.trailAge = 1
            }
          }
          
          // Play footstep sound based on level terrain
          ensureAudioInitialized().then(() => {
            const terrainTypes = ['grass', 'stone', 'sand', 'wood', 'grass']
            const terrainType = terrainTypes[currentLevel - 1] || 'grass'
            natureSounds.playFootstepSequence(terrainType, 1)
            
            // Play creature-specific sounds occasionally during movement
            if (stepIndex % 3 === 0) { // Every 3rd step
              setTimeout(() => {
                const creatureSounds = {
                  '🐢': 'turtleCall',
                  '🐱': 'catMeow', 
                  '🐉': 'dragonRoar',
                  '🐰': 'rabbitChirp',
                  '🦌': 'deerCall'
                }
                
                const creatureSound = creatureSounds[currentLevelData.creature]
                if (creatureSound && natureSounds[creatureSound]) {
                  natureSounds[creatureSound]()
                }
              }, 150) // Slight delay after footstep
            }
          })
        }
        
        setGrid(newGrid)
        stepIndex++
      } else {
        clearInterval(animationInterval)
        setAnimationProgress(100)
        
        const finalGrid = [...grid]
        finalGrid.forEach(row => row.forEach(tile => {
          tile.isTrail = false
          tile.trailAge = 0
        }))
        setGrid(finalGrid)
        
        if (isCorrect) {
          unlockNextLevel()
          
          // Play treasure found sound
          ensureAudioInitialized().then(() => {
            natureSounds.treasureFound()
            
            // Play creature celebration sound
            setTimeout(() => {
              const creatureSounds = {
                '🐢': 'turtleCall',
                '🐱': 'catMeow', 
                '🐉': 'dragonRoar',
                '🐰': 'rabbitChirp',
                '🦌': 'deerCall'
              }
              
              const creatureSound = creatureSounds[currentLevelData.creature]
              if (creatureSound && natureSounds[creatureSound]) {
                natureSounds[creatureSound]()
              }
            }, 800) // After treasure sound
          })
        }
        
        setGamePhase(GAME_PHASES.RESULT)
      }
    }, 200)
  }
  
  // Timer effects
  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) return

    let timer
    
    if (gamePhase === GAME_PHASES.PATH_PREVIEW) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase(GAME_PHASES.PATH_SELECTION)
            setGrid(hidePathInGrid(grid))
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
            checkPath()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameState, gamePhase, grid])

  // Global mouse up handler
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">🗺️ Choose Your Expedition 🗺️</h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{totalGameScore.toLocaleString()} Expedition Points</div>
                <div className="flex justify-center items-center gap-4 text-sm text-slate-600">
                  <span>🗺️ {Object.keys(highScores).length} Expeditions Completed</span>
                  {perfectStreak > 0 && <span>🔥 {perfectStreak} Perfect Streak</span>}
                  <span>🌟 {unlockedLevels.length}/5 Territories Explored</span>
                </div>
                {isMasterComplete && (
                  <div className="mt-3 pt-2 border-t border-purple-200">
                    <div className="flex items-center justify-center gap-2 text-lg font-bold text-purple-600">
                      <span>👑</span>
                      <span>MASTER EXPLORER</span>
                      <span>👑</span>
                    </div>
                    <div className="text-sm text-purple-500">Congratulations! You've conquered all expeditions!</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(LEVELS).map(([levelNum, level]) => {
                const isUnlocked = unlockedLevels.includes(parseInt(levelNum))
                const isCompleted = unlockedLevels.includes(parseInt(levelNum) + 1)
                
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
                    
                    <div className="text-center">
                      <div className="text-4xl mb-2">{level.creature}</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Expedition {levelNum}</h3>
                      <p className="text-lg text-slate-600 mb-3">{level.name}</p>
                      <div className="text-sm text-slate-500 space-y-1">
                        <p>📐 Territory: {level.gridSize}×{level.gridSize}</p>
                        <p>⏱️ Study Map: {level.viewTime/1000}s | Navigate: {level.selectionTime/1000}s</p>
                        <p>🎯 Mission: Guide {level.creature} to {level.goal}</p>
                        <p className="text-orange-600 font-medium">🎲 {level.pathVariations.length} Different Route Variations</p>
                      </div>
                      
                      {isUnlocked && highScores[levelNum] && (
                        <div className="mt-3 pt-2 border-t border-slate-200">
                          <p className="text-xs text-blue-600 font-medium">
                            🏆 Best Expedition Score: {highScores[levelNum].toLocaleString()} pts
                          </p>
                        </div>
                      )}
                      
                      {!isUnlocked && (
                        <p className="text-sm text-orange-600 mt-3 font-medium">
                          Complete previous expedition to unlock!
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

  if (gameState === GAME_STATES.ACHIEVEMENTS) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-4xl w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">🏆 Expedition Achievements</h2>
            
            <div className="mb-6 text-center">
              <div className="text-lg text-slate-600">
                {achievements.length} of {Object.keys(ACHIEVEMENTS).length} unlocked
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(achievements.length / Object.keys(ACHIEVEMENTS).length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto">
              {Object.values(ACHIEVEMENTS).map((achievement) => {
                const isUnlocked = achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-md'
                        : 'bg-gray-50 border-gray-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>
                        {isUnlocked ? achievement.icon : '🔒'}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isUnlocked ? 'text-purple-700' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${isUnlocked ? 'text-slate-600' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                        {isUnlocked && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✓ Unlocked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
              <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">📊 Your Expedition Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{gameStats.levelsCompleted}</div>
                  <div className="text-xs text-slate-600">Expeditions Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{gameStats.perfectCompletions}</div>
                  <div className="text-xs text-slate-600">Flawless Missions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{gameStats.totalScore.toLocaleString()}</div>
                  <div className="text-xs text-slate-600">Total Expedition Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{gameStats.maxStreak}</div>
                  <div className="text-xs text-slate-600">Best Streak</div>
                </div>
              </div>
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
                <span className="text-xl">🗺️</span>
                <p><strong>Study the route:</strong> Watch the blue path carefully - the brave creatures need to reach their treasures!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧠</span>
                <p><strong>Remember everything:</strong> Memorize both the safe route AND dangerous trap locations!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🫥</span>
                <p><strong>Hidden traps:</strong> Traps disappear during navigation - avoid clicking them!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <p><strong>Beat the clock:</strong> You have limited time to recreate the route - work fast!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🖱️</span>
                <p><strong>Draw the route:</strong> Click or drag across tiles to smoothly recreate the path</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎉</span>
                <p><strong>Perfect navigation = celebrations:</strong> Guide creatures safely for magical rewards!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏆</span>
                <p><strong>Advanced scoring:</strong> Earn points for accuracy, speed bonuses, perfect completion, and combo multipliers!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎲</span>
                <p><strong>Random routes:</strong> Every expedition has a different path layout - stay sharp and adapt quickly!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎒</span>
                <p><strong>Expedition supplies:</strong> Earn supplies by completing expeditions perfectly! Use Extra Time (⏱️), Ancient Maps (💡), or Scout Reports (🔍)!</p>
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
        
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="confetti absolute text-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  '--delay': `${Math.random() * 2}s`,
                  color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)]
                }}
              >
                {['🎉', '🎊', '⭐', '🌟', '💫', '✨'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}
          
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-2xl w-full text-center ${showSparkles ? 'success-glow' : ''}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentLevelData.creature} {currentLevelData.name}</h2>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>Expedition {currentLevel}</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">🎲 Random Route</span>
              </div>
              {gamePhase === GAME_PHASES.PATH_PREVIEW && (
                <div>
                  <p className="text-slate-600 mb-2">Study the ancient route carefully! The brave {currentLevelData.creature} must reach the precious {currentLevelData.goal}.</p>
                  <div className="text-3xl font-bold text-blue-600">{timeLeft}s</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.PATH_SELECTION && (
                <div>
                  <p className="text-slate-600 mb-2">Navigate from memory! Dangerous traps are now hidden - avoid them!</p>
                  <div className="text-2xl font-bold text-orange-600 mb-2">⏰ {selectionTimeLeft}s</div>
                  <p className="text-sm text-slate-500">💡 Green tiles = your route. Red flash = hidden trap hit!</p>
                </div>
              )}
              {gamePhase === GAME_PHASES.CREATURE_MOVING && (
                <div>
                  <p className="text-slate-600 mb-2">The brave {currentLevelData.creature.includes('🐢') ? 'turtle' : currentLevelData.creature.includes('🐱') ? 'cat' : currentLevelData.creature.includes('🐉') ? 'dragon' : 'rabbit'} is following your expedition route...</p>
                  <div className="text-lg text-blue-600 mb-2">Watch the adventure unfold!</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-200" 
                      style={{width: `${animationProgress}%`}}
                    ></div>
                  </div>
                  <div className="text-sm text-slate-500">{animationProgress}% expedition complete</div>
                </div>
              )}
              {gamePhase === GAME_PHASES.RESULT && (
                <div>
                  <p className="text-slate-600 mb-3">{score === 100 ? "Mission Success! 🎉" : "Expedition continues! 👍"}</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{detailedScore.totalScore.toLocaleString()} Expedition Points!</div>
                    
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
                          <span className="text-slate-600">Flawless Mission Bonus:</span>
                          <span className="font-semibold text-purple-600">+{detailedScore.perfectBonus}</span>
                        </div>
                      )}
                      {detailedScore.comboMultiplier > 1 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Expedition Streak Multiplier (x{detailedScore.comboMultiplier.toFixed(1)}):</span>
                          <span className="font-semibold text-orange-600">Applied!</span>
                        </div>
                      )}
                    </div>
                    
                    {perfectStreak > 0 && (
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <p className="text-sm text-purple-600 font-medium">🔥 Perfect Expedition Streak: {perfectStreak} territories!</p>
                      </div>
                    )}
                    
                    {highScores[currentLevel] && (
                      <div className="mt-2 text-xs text-slate-500">
                        Personal Best: {highScores[currentLevel].toLocaleString()} pts
                        {detailedScore.totalScore > highScores[currentLevel] && 
                          <span className="text-green-600 font-medium"> • NEW EXPEDITION RECORD! 🏆</span>
                        }
                      </div>
                    )}
                    
                    {score === 100 && (
                      <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-xs text-purple-600 font-medium text-center">🎒 Expedition Supplies Earned!</div>
                        <div className="flex justify-center gap-2 mt-1 text-xs">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">⏱️ +1 Extra Time</span>
                          {detailedScore.totalScore > 1500 && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">💡 +1 Ancient Map</span>
                          )}
                          {perfectStreak >= 2 && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">💡 +1 Streak Bonus</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {score === 100 ? (
                    <p className="text-sm text-green-600 mt-1">The brave {currentLevelData.creature.includes('🐢') ? 'turtle' : currentLevelData.creature.includes('🐱') ? 'cat' : currentLevelData.creature.includes('🐉') ? 'dragon' : 'rabbit'} reached the treasure! {currentLevelData.goal}</p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">The {currentLevelData.creature.includes('🐢') ? 'turtle' : currentLevelData.creature.includes('🐱') ? 'cat' : currentLevelData.creature.includes('🐉') ? 'dragon' : 'rabbit'} got lost in the wilderness... Try again! 🤔</p>
                  )}
                </div>
              )}
            </div>
            
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
            
            {gamePhase === GAME_PHASES.PATH_PREVIEW && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-4 bg-slate-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded border"></div>
                    <span className="text-sm text-slate-600">Safe Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentLevelData.creature}</span>
                    <span className="text-sm text-slate-600">Brave Explorer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentLevelData.goal}</span>
                    <span className="text-sm text-slate-600">Treasure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪨</span>
                    <span className="text-sm text-slate-600">Danger</span>
                  </div>
                </div>
              </div>
            )}
            
            {gamePhase === GAME_PHASES.PATH_SELECTION && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-4 bg-slate-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded border"></div>
                    <span className="text-sm text-slate-600">Your Route</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Selected: {userPath.length} tiles
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    ⚠️ Traps are now hidden!
                  </div>
                </div>
              </div>
            )}
            
            {gamePhase === GAME_PHASES.PATH_SELECTION && (
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="text-sm font-medium text-purple-700 mb-2 text-center">🎒 Expedition Supplies Available</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => usePowerUp('extraTime')}
                    disabled={powerUps.extraTime <= 0 || activePowerUps.extraTime}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      powerUps.extraTime > 0 && !activePowerUps.extraTime
                        ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Add 5 extra seconds"
                  >
                    ⏱️ +5s
                    <div className="text-xs">{powerUps.extraTime}</div>
                  </button>
                  
                  <button
                    onClick={() => usePowerUp('revealHint')}
                    disabled={powerUps.revealHint <= 0 || activePowerUps.revealHint}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      powerUps.revealHint > 0 && !activePowerUps.revealHint
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Reveal 3 correct tiles for 2 seconds"
                  >
                    💡 Map
                    <div className="text-xs">{powerUps.revealHint}</div>
                  </button>
                  
                  <button
                    onClick={() => usePowerUp('obstacleScan')}
                    disabled={powerUps.obstacleScan <= 0 || activePowerUps.obstacleScan}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      powerUps.obstacleScan > 0 && !activePowerUps.obstacleScan
                        ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-105'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Reveal obstacles for 3 seconds"
                  >
                    🔍 Scout
                    <div className="text-xs">{powerUps.obstacleScan}</div>
                  </button>
                </div>
                
                <div className="mt-2 flex justify-center gap-2 text-xs">
                  {activePowerUps.extraTime && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">⏱️ Extra Time Active</span>
                  )}
                  {activePowerUps.revealHint && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">💡 Map Active</span>
                  )}
                  {activePowerUps.obstacleScan && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">🔍 Scout Active</span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {gamePhase === GAME_PHASES.PATH_SELECTION && (
                <div className="space-y-2">
                  <button 
                    onClick={checkPath}
                    disabled={userPath.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    🗺️ Launch Expedition!
                  </button>
                  <button 
                    onClick={() => {
                      setUserPath([])
                      const newGrid = [...grid]
                      newGrid.forEach(row => row.forEach(tile => tile.isSelectedByUser = false))
                      setGrid(newGrid)
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    🗑️ Clear Route
                  </button>
                </div>
              )}
              
              {gamePhase === GAME_PHASES.RESULT && (
                <div className="space-y-2">
                  <button 
                    onClick={() => startGame(currentLevel)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    🎮 Retry Expedition
                  </button>
                  
                  {score === 100 && unlockedLevels.includes(currentLevel + 1) && LEVELS[currentLevel + 1] && (
                    <button 
                      onClick={() => startGame(currentLevel + 1)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      🌟 Next Expedition: {LEVELS[currentLevel + 1].name}
                    </button>
                  )}
                  
                  <button 
                    onClick={showLevelSelect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    🗺️ Choose Expedition
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
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100">
        <div className="absolute inset-0 bg-white/30"></div>
      </div>
      
      {/* Sound Control Panel */}
      <SoundControlPanel />
      
      {/* Sound Control Button - Fixed Position */}
      <button 
        onClick={toggleSoundPanel}
        className="fixed top-4 left-4 z-40 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-95"
        title="Sound Control"
      >
        <span className="text-xl">🎵</span>
      </button>
      
      {newAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {newAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-xl border-2 border-white/20 transform achievement-popup"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <div className="text-sm font-bold">🏆 Achievement Unlocked!</div>
                  <div className="text-lg font-bold">{achievement.title}</div>
                  <div className="text-sm opacity-90">{achievement.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-5xl mb-4">🗺️</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Expedition Quest
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Brave creatures have ventured into uncharted territories seeking legendary treasures! 
              <span className="font-semibold text-slate-900"> Study the ancient maps</span> and guide them safely through treacherous terrain to their precious goals!
            </p>
          </div>
        
          <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-700 leading-relaxed">
              Brave creatures have ventured into uncharted territories seeking legendary treasures! 
              <span className="font-semibold text-slate-900"> Study the ancient maps</span> and guide them safely through treacherous terrain to their precious goals!
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button onClick={() => startGame(currentLevel)} className="group w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg">
              <span className="flex items-center justify-center gap-2">
                <span className="group-hover:scale-110 transition-transform">🗺️</span>
                Continue Expedition {currentLevel}
              </span>
            </button>
            
            <button onClick={showLevelSelect} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-2">
                <span>🌟</span>
                Choose Expedition
              </span>
            </button>
            
            <button onClick={showInstructions} className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-slate-700 font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              How to Play
            </button>
            
            <button onClick={showAchievements} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-2">
                <span>🏆</span>
                Achievements ({achievements.length}/{Object.keys(ACHIEVEMENTS).length})
              </span>
            </button>
            
            <button onClick={toggleSoundPanel} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-2">
                <span>🎵</span>
                Sound Control
              </span>
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg">{currentLevelData.creature}</span>
              <span className="font-semibold text-slate-800">Expedition {currentLevel}: {currentLevelData.name}</span>
            </div>
            <div className="text-sm text-slate-600">{currentLevelData.gridSize}×{currentLevelData.gridSize} Territory • Navigation Challenge</div>
            <div className="text-xs text-blue-600 mt-1">Guide the brave {currentLevelData.creature} to the precious {currentLevelData.goal}! </div>
            
            {isMasterComplete && (
              <div className="mt-3 pt-2 border-t border-blue-200">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-purple-600">
                  <span>👑</span>
                  <span>MASTER EXPLORER</span>
                  <span>👑</span>
                </div>
                <div className="text-xs text-purple-500 text-center mt-1">All expeditions conquered!</div>
              </div>
            )}
            
            <div className="mt-3 pt-2 border-t border-blue-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Expedition Points:</span>
                <span className="font-bold text-blue-600">{totalGameScore.toLocaleString()} pts</span>
              </div>
              {perfectStreak > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Perfect Streak:</span>
                  <span className="font-bold text-purple-600">🔥 {perfectStreak}</span>
                </div>
              )}
              <div className="text-xs text-slate-500 mt-1">
                {unlockedLevels.length > 1 && `🎉 ${unlockedLevels.length}/5 territories explored!`}
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-purple-200">
              <div className="text-xs text-purple-600 font-medium mb-1 text-center">🎒 Expedition Supplies</div>
              <div className="flex justify-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-green-600">⏱️</span>
                  <span className="text-slate-600">Extra Time:</span>
                  <span className="font-bold text-green-600">{powerUps.extraTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-600">💡</span>
                  <span className="text-slate-600">Maps:</span>
                  <span className="font-bold text-yellow-600">{powerUps.revealHint}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-600">🔍</span>
                  <span className="text-slate-600">Scouts:</span>
                  <span className="font-bold text-red-600">{powerUps.obstacleScan}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1 text-center">
                Earn supplies by completing expeditions perfectly!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
