"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert, BackHandler, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useGameContext } from "../context/GameContext"
import { useAudio } from "../context/AudioContext"
import Board from "../components/Board"
import WinnerModal from "../components/WinnerModal"
import { checkWinner, getAIMove } from "../utils/gameLogic"
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated"

export default function GameScreen() {
  const router = useRouter()
  const {
    boardSize,
    gameMode,
    playerSymbol,
    playerStreak,
    opponentStreak,
    incrementPlayerStreak,
    incrementOpponentStreak,
  } = useGameContext()
  const { playSound } = useAudio()

  const opponentSymbol = playerSymbol === "X" ? "O" : "X"
  const [board, setBoard] = useState<(string | null)[][]>(
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "draw">("playing")
  const [winner, setWinner] = useState<string | null>(null)
  const [winningCells, setWinningCells] = useState<[number, number][]>([])
  const [showWinnerModal, setShowWinnerModal] = useState(false)

  // Animation values
  const playerStreakScale = useSharedValue(1)
  const opponentStreakScale = useSharedValue(1)
  const lastWinner = useRef<string | null>(null)

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (gameStatus !== "playing") {
        router.back()
        return true
      }

      Alert.alert("Quit Game", "Are you sure you want to quit? Your progress will be lost.", [
        { text: "Cancel", style: "cancel", onPress: () => {} },
        { text: "Quit", style: "destructive", onPress: () => router.back() },
      ])
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => backHandler.remove()
  }, [gameStatus, router])

  // AI move logic
  useEffect(() => {
    if (gameMode === "single" && currentPlayer !== playerSymbol && gameStatus === "playing") {
      // Add a small delay to make the AI move feel more natural
      const timeoutId = setTimeout(() => {
        makeAIMove()
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [currentPlayer, gameMode, gameStatus, playerSymbol])

  // Animate streak counter when it changes
  useEffect(() => {
    if (lastWinner.current === playerSymbol) {
      playerStreakScale.value = withSequence(withTiming(1.3, { duration: 300 }), withTiming(1, { duration: 300 }))
    } else if (lastWinner.current === opponentSymbol) {
      opponentStreakScale.value = withSequence(withTiming(1.3, { duration: 300 }), withTiming(1, { duration: 300 }))
    }
  }, [playerStreak, opponentStreak])

  const playerStreakStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: playerStreakScale.value }],
    }
  })

  const opponentStreakStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: opponentStreakScale.value }],
    }
  })

  const makeAIMove = () => {
    const aiMove = getAIMove(board, opponentSymbol, playerSymbol, boardSize)
    if (aiMove) {
      handleCellPress(aiMove.row, aiMove.col)
    }
  }

  const handleCellPress = (row: number, col: number) => {
    if (board[row][col] !== null || gameStatus !== "playing") return

    // Play sound
    playSound("move")

    // Create a deep copy of the board
    const newBoard = board.map((row) => [...row])
    newBoard[row][col] = currentPlayer

    setBoard(newBoard)

    // Check for winner
    const result = checkWinner(newBoard, boardSize)
    if (result.winner) {
      setGameStatus("won")
      setWinner(result.winner)
      setWinningCells(result.winningCells || [])
      setShowWinnerModal(true)
      playSound("win")

      // Update win streak
      if (result.winner === playerSymbol) {
        incrementPlayerStreak()
        lastWinner.current = playerSymbol
      } else {
        incrementOpponentStreak()
        lastWinner.current = opponentSymbol
      }
    } else if (result.isDraw) {
      setGameStatus("draw")
      setShowWinnerModal(true)
      playSound("draw")
    } else {
      // Switch player
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const restartGame = () => {
    // Reset the game state
    setBoard(
      Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(null)),
    )
    setCurrentPlayer("X")
    setGameStatus("playing")
    setWinner(null)
    setWinningCells([])
    setShowWinnerModal(false)
    playSound("restart")
  }

  const getStatusText = () => {
    if (gameStatus === "won") {
      return `${winner} Wins!`
    } else if (gameStatus === "draw") {
      return "It's a Draw!"
    } else {
      const currentPlayerName =
        currentPlayer === playerSymbol
          ? gameMode === "single"
            ? "Your"
            : "Player 1"
          : gameMode === "single"
            ? "AI"
            : "Player 2"
      return `${currentPlayerName} Turn (${currentPlayer})`
    }
  }

  const getPlayerName = (symbol: string) => {
    if (gameMode === "single") {
      return symbol === playerSymbol ? "You" : "AI"
    } else {
      return symbol === "X" ? "Player 1" : "Player 2"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            playSound("button")
            if (gameStatus !== "playing") {
              router.back()
            } else {
              Alert.alert("Quit Game", "Are you sure you want to quit? Your progress will be lost.", [
                { text: "Cancel", style: "cancel", onPress: () => {} },
                {
                  text: "Quit",
                  style: "destructive",
                  onPress: () => {
                    playSound("button")
                    router.back()
                  },
                },
              ])
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {boardSize}x{boardSize} {gameMode === "single" ? "Single Player" : "Two Players"}
        </Text>
      </View>

      <View style={styles.streakContainer}>
        <Animated.View style={[styles.streakBox, playerStreakStyle]}>
          <Text style={styles.streakPlayer}>
            {getPlayerName(playerSymbol)} ({playerSymbol})
          </Text>
          <Text style={styles.streakCount}>{playerStreak}</Text>
          <Text style={styles.streakLabel}>Streak</Text>
        </Animated.View>

        <View style={styles.streakDivider} />

        <Animated.View style={[styles.streakBox, opponentStreakStyle]}>
          <Text style={styles.streakPlayer}>
            {getPlayerName(opponentSymbol)} ({opponentSymbol})
          </Text>
          <Text style={styles.streakCount}>{opponentStreak}</Text>
          <Text style={styles.streakLabel}>Streak</Text>
        </Animated.View>
      </View>

      <Animated.View style={styles.statusContainer} entering={FadeIn.duration(500)}>
        <Text
          style={[styles.statusText, gameStatus === "won" && styles.winText, gameStatus === "draw" && styles.drawText]}
        >
          {getStatusText()}
        </Text>
      </Animated.View>

      <View style={styles.boardContainer}>
        <Board
          board={board}
          boardSize={boardSize}
          onCellPress={handleCellPress}
          winningCells={winningCells}
          disabled={gameStatus !== "playing" || (gameMode === "single" && currentPlayer !== playerSymbol)}
        />
      </View>

      {showWinnerModal && (
        <WinnerModal
          winner={winner}
          isDraw={gameStatus === "draw"}
          onPlayAgain={restartGame}
          onMainMenu={() => {
            playSound("button")
            router.back()
          }}
          playerName={winner === playerSymbol ? getPlayerName(playerSymbol) : getPlayerName(opponentSymbol)}
        />
      )}
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  title: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginRight: 44, // To center the title accounting for the back button width
  },
  streakContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  streakBox: {
    flex: 1,
    alignItems: "center",
  },
  streakPlayer: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  streakCount: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#4c669f",
  },
  streakLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
  },
  streakDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#333",
  },
  winText: {
    color: "#4CAF50",
  },
  drawText: {
    color: "#FF9800",
  },
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
})
