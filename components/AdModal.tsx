"use client"

import { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated"
import { adManager, type AdType } from "../utils/adManager"

interface AdModalProps {
  adType: AdType
  onClose: (rewarded: boolean) => void
  onCancel: () => void
}

export default function AdModal({ adType, onClose, onCancel }: AdModalProps) {
  const [adState, setAdState] = useState<"loading" | "ready" | "watching" | "failed">("loading")

  useEffect(() => {
    // Set up ad callbacks
    adManager.setCallbacks({
      onAdLoaded: () => setAdState("ready"),
      onAdClosed: (rewarded) => {
        setAdState("loading")
        onClose(rewarded)
      },
      onAdFailed: () => setAdState("failed"),
    })

    // Load the ad
    loadAd()

    return () => {
      // In a real implementation, you would clean up listeners here
      // adManager.removeAllListeners();
    }
  }, [adType, onClose])

  const loadAd = async () => {
    setAdState("loading")
    await adManager.loadAd(adType)
  }

  const watchAd = async () => {
    if (adState === "ready") {
      setAdState("watching")
      await adManager.showAd(adType)
    }
  }

  const getTitle = () => {
    switch (adType) {
      case "undo":
        return "Watch Ad to Undo"
      case "streak":
        return "Maintain Your Streak"
      case "regular":
        return "Ad Break"
      default:
        return "Watch Ad"
    }
  }

  const getMessage = () => {
    switch (adType) {
      case "undo":
        return "Watch a short ad to undo your last move and get another chance!"
      case "streak":
        return "Don't break your winning streak! Watch a short ad to continue your game."
      case "regular":
        return "Please watch a short ad to support the game developers."
      default:
        return "Watch a short advertisement to continue."
    }
  }

  return (
    <Animated.View style={styles.overlay} entering={FadeIn.duration(300)}>
      <Animated.View style={styles.modal} entering={SlideInUp.springify().damping(15)}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          {adType !== "regular" && (
            <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {adState === "loading" ? (
              <ActivityIndicator size="large" color="#6200ee" />
            ) : adState === "failed" ? (
              <Ionicons name="alert-circle" size={60} color="#F44336" />
            ) : (
              <Ionicons
                name={adType === "undo" ? "arrow-undo" : adType === "streak" ? "trophy" : "videocam"}
                size={60}
                color="#6200ee"
              />
            )}
          </View>

          <Text style={styles.message}>{getMessage()}</Text>

          {adState === "failed" && (
            <Text style={styles.errorMessage}>
              Failed to load advertisement. Please try again or check your internet connection.
            </Text>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {adState === "failed" ? (
            <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={loadAd}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          ) : adState === "ready" ? (
            <TouchableOpacity style={[styles.button, styles.watchButton]} onPress={watchAd}>
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.buttonText}>Watch Ad</Text>
            </TouchableOpacity>
          ) : adState === "watching" ? (
            <View style={[styles.button, styles.watchingButton]}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.buttonText}>Watching...</Text>
            </View>
          ) : (
            <View style={[styles.button, styles.loadingButton]}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.buttonText}>Loading Ad...</Text>
            </View>
          )}

          {adType !== "regular" && adState !== "watching" && (
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>No Thanks</Text>
            </TouchableOpacity>
          )}
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
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    height: 60,
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: "#F44336",
    textAlign: "center",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    flex: 1,
  },
  watchButton: {
    backgroundColor: "#6200ee",
  },
  loadingButton: {
    backgroundColor: "#9c4dff",
  },
  watchingButton: {
    backgroundColor: "#9c4dff",
  },
  retryButton: {
    backgroundColor: "#FF9800",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})
