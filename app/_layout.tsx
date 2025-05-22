"use client"

import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { GameProvider } from "../context/GameContext"
import { AudioProvider } from "../context/AudioContext"
import { useEffect } from "react"
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen once fonts are loaded
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <AudioProvider>
      <GameProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f8f9fa" },
            animation: "fade",
          }}
        />
      </GameProvider>
    </AudioProvider>
  )
}
