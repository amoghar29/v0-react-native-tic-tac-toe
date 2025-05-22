"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useGameContext } from "../context/GameContext"
import { useAudio } from "../context/AudioContext"
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated"

export default function SetupScreen() {
  const router = useRouter()
  const { setBoardSize, setGameMode, setPlayerSymbol, resetStreaks } = useGameContext()
  const { playSound } = useAudio()

  const [selectedBoardSize, setSelectedBoardSize] = useState<"3x3" | "5x5">("3x3")
  const [selectedGameMode, setSelectedGameMode] = useState<"single" | "two">("single")
  const [selectedSymbol, setSelectedSymbol] = useState<"X" | "O">("X")

  const handleBoardSizeSelect = (size: "3x3" | "5x5") => {
    playSound("button")
    setSelectedBoardSize(size)
  }

  const handleGameModeSelect = (mode: "single" | "two") => {
    playSound("button")
    setSelectedGameMode(mode)
  }

  const handleSymbolSelect = (symbol: "X" | "O") => {
    playSound("button")
    setSelectedSymbol(symbol)
  }

  const startGame = () => {
    playSound("start")
    setBoardSize(selectedBoardSize === "3x3" ? 3 : 5)
    setGameMode(selectedGameMode)
    setPlayerSymbol(selectedSymbol)
    resetStreaks() // Reset streaks when starting a new game session
    router.push("/game")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              playSound("button")
              router.back()
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Game Setup</Text>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View style={styles.optionContainer} entering={FadeIn.delay(200).duration(500)}>
          <Text style={styles.optionTitle}>Board Size</Text>
          <View style={styles.optionButtons}>
            <TouchableOpacity
              style={[styles.optionButton, selectedBoardSize === "3x3" && styles.selectedOption]}
              onPress={() => handleBoardSizeSelect("3x3")}
            >
              <Text style={[styles.optionText, selectedBoardSize === "3x3" && styles.selectedOptionText]}>3x3</Text>
              <Text style={[styles.optionSubtext, selectedBoardSize === "3x3" && styles.selectedOptionText]}>
                Classic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, selectedBoardSize === "5x5" && styles.selectedOption]}
              onPress={() => handleBoardSizeSelect("5x5")}
            >
              <Text style={[styles.optionText, selectedBoardSize === "5x5" && styles.selectedOptionText]}>5x5</Text>
              <Text style={[styles.optionSubtext, selectedBoardSize === "5x5" && styles.selectedOptionText]}>
                Challenge
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={styles.optionContainer} entering={FadeIn.delay(400).duration(500)}>
          <Text style={styles.optionTitle}>Game Mode</Text>
          <View style={styles.optionButtons}>
            <TouchableOpacity
              style={[styles.optionButton, selectedGameMode === "single" && styles.selectedOption]}
              onPress={() => handleGameModeSelect("single")}
            >
              <Ionicons
                name="person"
                size={24}
                color={selectedGameMode === "single" ? "white" : "#333"}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, selectedGameMode === "single" && styles.selectedOptionText]}>
                Single Player
              </Text>
              <Text style={[styles.optionSubtext, selectedGameMode === "single" && styles.selectedOptionText]}>
                Play against AI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, selectedGameMode === "two" && styles.selectedOption]}
              onPress={() => handleGameModeSelect("two")}
            >
              <Ionicons
                name="people"
                size={24}
                color={selectedGameMode === "two" ? "white" : "#333"}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, selectedGameMode === "two" && styles.selectedOptionText]}>
                Two Players
              </Text>
              <Text style={[styles.optionSubtext, selectedGameMode === "two" && styles.selectedOptionText]}>
                Play with a friend
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={styles.optionContainer} entering={FadeIn.delay(600).duration(500)}>
          <Text style={styles.optionTitle}>Your Symbol</Text>
          <View style={styles.symbolContainer}>
            <TouchableOpacity
              style={[styles.symbolButton, selectedSymbol === "X" && styles.selectedSymbol]}
              onPress={() => handleSymbolSelect("X")}
            >
              <Text style={[styles.symbolText, selectedSymbol === "X" && styles.selectedSymbolText]}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.symbolButton, selectedSymbol === "O" && styles.selectedSymbol]}
              onPress={() => handleSymbolSelect("O")}
            >
              <Text style={[styles.symbolText, selectedSymbol === "O" && styles.selectedSymbolText]}>O</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={SlideInRight.delay(800).duration(500)}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
            <Ionicons name="play" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#333",
  },
  optionContainer: {
    width: "100%",
    marginBottom: 30,
  },
  optionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  optionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#f1f3f5",
    width: width * 0.4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "#4c669f",
  },
  optionIcon: {
    marginBottom: 5,
  },
  optionText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  optionSubtext: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  selectedOptionText: {
    color: "white",
  },
  symbolContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  symbolButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f3f5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedSymbol: {
    backgroundColor: "#4c669f",
  },
  symbolText: {
    fontFamily: "Poppins-Bold",
    fontSize: 40,
    color: "#333",
  },
  selectedSymbolText: {
    color: "white",
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#4c669f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: width * 0.8,
  },
  startButtonText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 18,
  },
})
