"use client"

import { StyleSheet, View, Text, TouchableOpacity, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAudio } from "../context/AudioContext"
import Animated, { FadeInDown } from "react-native-reanimated"

export default function SettingsScreen() {
  const router = useRouter()
  const { isSoundEnabled, isMusicEnabled, toggleSound, toggleMusic, playSound } = useAudio()

  const handleSoundToggle = () => {
    if (isSoundEnabled) {
      playSound("button")
    }
    toggleSound()
  }

  const handleMusicToggle = () => {
    if (isSoundEnabled) {
      playSound("button")
    }
    toggleMusic()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isSoundEnabled) {
              playSound("button")
            }
            router.back()
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="volume-high" size={24} color="#4c669f" style={styles.settingIcon} />
            <View>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sounds for game actions</Text>
            </View>
          </View>
          <Switch
            value={isSoundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{ false: "#d1d1d1", true: "#4c669f" }}
            thumbColor={isSoundEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#d1d1d1"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="musical-notes" size={24} color="#4c669f" style={styles.settingIcon} />
            <View>
              <Text style={styles.settingTitle}>Background Music</Text>
              <Text style={styles.settingDescription}>Play music during gameplay</Text>
            </View>
          </View>
          <Switch
            value={isMusicEnabled}
            onValueChange={handleMusicToggle}
            trackColor={{ false: "#d1d1d1", true: "#4c669f" }}
            thumbColor={isMusicEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#d1d1d1"
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>About</Text>
        <Text style={styles.aboutText}>
          Tic-Tac-Toe is a classic game of X's and O's. Place your mark in a 3x3 or 5x5 grid and try to get three or
          more in a row, column, or diagonal.
        </Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
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
  settingsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  settingDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  aboutContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aboutTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  aboutText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 15,
  },
  versionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
})
