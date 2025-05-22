import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated"
import { useAudio } from "../context/AudioContext"
import Confetti from "./Confetti"

interface WinnerModalProps {
  winner: string | null
  isDraw: boolean
  onPlayAgain: () => void
  onMainMenu: () => void
  playerName: string
}

export default function WinnerModal({ winner, isDraw, onPlayAgain, onMainMenu, playerName }: WinnerModalProps) {
  const { playSound } = useAudio()

  return (
    <Animated.View style={styles.overlay} entering={FadeIn.duration(300)}>
      {!isDraw && <Confetti />}

      <Animated.View style={styles.card} entering={SlideInUp.springify().damping(15)}>
        <Text style={styles.title}>{isDraw ? "It's a Draw!" : `${playerName} Wins!`}</Text>

        <View style={styles.iconContainer}>
          {isDraw ? (
            <Ionicons name="remove-circle-outline" size={60} color="#FF9800" />
          ) : (
            <View style={styles.winnerSymbol}>
              <Text style={[styles.symbolText, winner === "X" ? styles.xText : styles.oText]}>{winner}</Text>
            </View>
          )}
        </View>

        <Text style={styles.message}>
          {isDraw ? "Great effort from both sides!" : `Congratulations on your victory!`}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={() => {
              playSound("button")
              onPlayAgain()
            }}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.mainMenuButton]} onPress={onMainMenu}>
            <Ionicons name="home" size={20} color="white" />
            <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    maxWidth: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  winnerSymbol: {
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
  symbolText: {
    fontFamily: "Poppins-Bold",
    fontSize: 40,
  },
  xText: {
    color: "#ff7675",
  },
  oText: {
    color: "#74b9ff",
  },
  message: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    gap: 8,
  },
  playAgainButton: {
    backgroundColor: "#4CAF50",
  },
  mainMenuButton: {
    backgroundColor: "#4c669f",
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 14,
  },
})
