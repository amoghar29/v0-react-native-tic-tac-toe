import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated"

interface WinnerCardProps {
  winner: string | null
  isDraw: boolean
  onPlayAgain: () => void
  onMainMenu: () => void
}

export default function WinnerCard({ winner, isDraw, onPlayAgain, onMainMenu }: WinnerCardProps) {
  return (
    <Animated.View style={styles.overlay} entering={FadeIn.duration(300)}>
      <Animated.View style={styles.card} entering={SlideInUp.springify().damping(15)}>
        <View style={styles.confetti}>
          {!isDraw &&
            Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.confettiPiece,
                  {
                    backgroundColor: ["#FF9800", "#4CAF50", "#2196F3", "#F44336", "#9C27B0"][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: [{ rotate: `${Math.random() * 360}deg` }, { scale: Math.random() * 0.5 + 0.5 }],
                  },
                ]}
              />
            ))}
        </View>

        <Text style={styles.title}>{isDraw ? "It's a Draw!" : `${winner} Wins!`}</Text>

        <View style={styles.iconContainer}>
          {isDraw ? (
            <Ionicons name="remove-circle-outline" size={60} color="#FF9800" />
          ) : (
            <Ionicons name="trophy" size={60} color="#FFD700" />
          )}
        </View>

        <Text style={styles.message}>
          {isDraw ? "Great effort from both sides!" : "Congratulations on your victory!"}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.playAgainButton]} onPress={onPlayAgain}>
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
    overflow: "hidden",
  },
  confetti: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  message: {
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
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
})
