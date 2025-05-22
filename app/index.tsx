"use client"

import { useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { useAudio } from "../context/AudioContext"

export default function WelcomeScreen() {
  const router = useRouter()
  const { playSound, playBackgroundMusic, isMusicEnabled } = useAudio()
  const scaleX = useSharedValue(1)
  const scaleO = useSharedValue(1)

  useEffect(() => {
    // Start the animation sequence
    const animationInterval = setInterval(() => {
      scaleX.value = withSequence(withTiming(1.2, { duration: 300 }), withTiming(1, { duration: 300 }))

      // Delay the O animation slightly
      setTimeout(() => {
        scaleO.value = withSequence(withTiming(1.2, { duration: 300 }), withTiming(1, { duration: 300 }))
      }, 150)
    }, 3000)

    // Play background music if enabled
    if (isMusicEnabled) {
      playBackgroundMusic()
    }

    return () => clearInterval(animationInterval)
  }, [isMusicEnabled])

  const animatedStyleX = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleX.value }],
    }
  })

  const animatedStyleO = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleO.value }],
    }
  })

  const handleStartPress = () => {
    playSound("button")
    router.push("/setup")
  }

  const handleSettingsPress = () => {
    playSound("button")
    router.push("/settings")
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.background} />

      <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.header}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>
        <Text style={styles.subtitle}>The classic game reimagined</Text>
      </Animated.View>

      <View style={styles.logoContainer}>
        <Animated.Text style={[styles.logoX, animatedStyleX]} entering={SlideInDown.delay(600).duration(800)}>
          X
        </Animated.Text>
        <Animated.Text style={[styles.logoO, animatedStyleO]} entering={SlideInDown.delay(900).duration(800)}>
          O
        </Animated.Text>
      </View>

      <Animated.View entering={FadeIn.delay(1200).duration(800)} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPress} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Game</Text>
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress} activeOpacity={0.8}>
          <Text style={styles.settingsButtonText}>Settings</Text>
          <Ionicons name="settings-outline" size={22} color="#4c669f" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(1500).duration(800)} style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Tic-Tac-Toe</Text>
      </Animated.View>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")
const logoSize = width * 0.25

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 36,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  logoX: {
    fontFamily: "Poppins-Bold",
    fontSize: logoSize,
    color: "#ff7675",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  logoO: {
    fontFamily: "Poppins-Bold",
    fontSize: logoSize,
    color: "#74b9ff",
    marginLeft: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#4c669f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 15,
  },
  startButtonText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
  settingsButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  settingsButtonText: {
    fontFamily: "Poppins-SemiBold",
    color: "#4c669f",
    fontSize: 16,
    marginRight: 10,
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
})
