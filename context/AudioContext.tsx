"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Audio } from "expo-av"

type SoundType = "button" | "move" | "win" | "draw" | "start" | "restart"

interface AudioContextType {
  isSoundEnabled: boolean
  isMusicEnabled: boolean
  toggleSound: () => void
  toggleMusic: () => void
  playSound: (type: SoundType) => void
  playBackgroundMusic: () => void
  stopBackgroundMusic: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true)
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(true)
  const [sounds, setSounds] = useState<Record<SoundType, Audio.Sound | null>>({
    button: null,
    move: null,
    win: null,
    draw: null,
    start: null,
    restart: null,
  })
  const [backgroundMusic, setBackgroundMusic] = useState<Audio.Sound | null>(null)

  // Load sounds on mount
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Configure audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        })

        // Load sound effects
        const buttonSound = new Audio.Sound()
        await buttonSound.loadAsync(require("../assets/sounds/button.mp3"))

        const moveSound = new Audio.Sound()
        await moveSound.loadAsync(require("../assets/sounds/move.mp3"))

        const winSound = new Audio.Sound()
        await winSound.loadAsync(require("../assets/sounds/win.mp3"))

        const drawSound = new Audio.Sound()
        await drawSound.loadAsync(require("../assets/sounds/draw.mp3"))

        const startSound = new Audio.Sound()
        await startSound.loadAsync(require("../assets/sounds/start.mp3"))

        const restartSound = new Audio.Sound()
        await restartSound.loadAsync(require("../assets/sounds/restart.mp3"))

        setSounds({
          button: buttonSound,
          move: moveSound,
          win: winSound,
          draw: drawSound,
          start: startSound,
          restart: restartSound,
        })

        // Load background music
        const music = new Audio.Sound()
        await music.loadAsync(require("../assets/sounds/background.mp3"))
        setBackgroundMusic(music)
      } catch (error) {
        console.error("Failed to load sounds:", error)
      }
    }

    loadSounds()

    // Cleanup on unmount
    return () => {
      Object.values(sounds).forEach(async (sound) => {
        if (sound) {
          await sound.unloadAsync()
        }
      })

      if (backgroundMusic) {
        backgroundMusic.unloadAsync()
      }
    }
  }, [])

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled)
  }

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled)

    if (!isMusicEnabled) {
      playBackgroundMusic()
    } else {
      stopBackgroundMusic()
    }
  }

  const playSound = async (type: SoundType) => {
    if (!isSoundEnabled || !sounds[type]) return

    try {
      // Stop and reset the sound before playing
      await sounds[type]?.stopAsync()
      await sounds[type]?.setPositionAsync(0)
      await sounds[type]?.playAsync()
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error)
    }
  }

  const playBackgroundMusic = async () => {
    if (!isMusicEnabled || !backgroundMusic) return

    try {
      // Loop the background music
      await backgroundMusic.setIsLoopingAsync(true)
      await backgroundMusic.setVolumeAsync(0.5)
      await backgroundMusic.playAsync()
    } catch (error) {
      console.error("Error playing background music:", error)
    }
  }

  const stopBackgroundMusic = async () => {
    if (!backgroundMusic) return

    try {
      await backgroundMusic.stopAsync()
    } catch (error) {
      console.error("Error stopping background music:", error)
    }
  }

  return (
    <AudioContext.Provider
      value={{
        isSoundEnabled,
        isMusicEnabled,
        toggleSound,
        toggleMusic,
        playSound,
        playBackgroundMusic,
        stopBackgroundMusic,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
