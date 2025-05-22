"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type GameMode = "single" | "two"
type PlayerSymbol = "X" | "O"

interface GameContextType {
  boardSize: number
  gameMode: GameMode
  playerSymbol: PlayerSymbol
  playerStreak: number
  opponentStreak: number
  setBoardSize: (size: number) => void
  setGameMode: (mode: GameMode) => void
  setPlayerSymbol: (symbol: PlayerSymbol) => void
  incrementPlayerStreak: () => void
  incrementOpponentStreak: () => void
  resetStreaks: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [boardSize, setBoardSize] = useState<number>(3)
  const [gameMode, setGameMode] = useState<GameMode>("single")
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>("X")
  const [playerStreak, setPlayerStreak] = useState<number>(0)
  const [opponentStreak, setOpponentStreak] = useState<number>(0)

  const incrementPlayerStreak = () => {
    setPlayerStreak(playerStreak + 1)
    setOpponentStreak(0) // Reset opponent streak when player wins
  }

  const incrementOpponentStreak = () => {
    setOpponentStreak(opponentStreak + 1)
    setPlayerStreak(0) // Reset player streak when opponent wins
  }

  const resetStreaks = () => {
    setPlayerStreak(0)
    setOpponentStreak(0)
  }

  return (
    <GameContext.Provider
      value={{
        boardSize,
        gameMode,
        playerSymbol,
        playerStreak,
        opponentStreak,
        setBoardSize,
        setGameMode,
        setPlayerSymbol,
        incrementPlayerStreak,
        incrementOpponentStreak,
        resetStreaks,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
