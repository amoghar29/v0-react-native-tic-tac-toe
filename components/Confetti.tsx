"use client"

import { useEffect, useState } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const CONFETTI_COUNT = 50
const COLORS = ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7", "#a29bfe", "#fd79a8", "#fab1a0"]

interface ConfettiPieceProps {
  index: number
}

const ConfettiPiece = ({ index }: ConfettiPieceProps) => {
  const translateY = useSharedValue(-20)
  const translateX = useSharedValue(0)
  const rotate = useSharedValue(0)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)

  // Random properties for each piece
  const [color] = useState(COLORS[Math.floor(Math.random() * COLORS.length)])
  const [size] = useState(Math.random() * 8 + 5)
  const [startX] = useState(Math.random() * SCREEN_WIDTH)
  const [rotationDirection] = useState(Math.random() > 0.5 ? 1 : -1)
  const [horizontalDirection] = useState((Math.random() - 0.5) * 2)
  const [fallSpeed] = useState(Math.random() * 3000 + 2000)

  useEffect(() => {
    // Start animation with a staggered delay
    const delay = index * (Math.random() * 200 + 50)

    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, { duration: fallSpeed, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
    )

    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(horizontalDirection * 50, { duration: fallSpeed / 3 }),
        withTiming(horizontalDirection * -50, { duration: fallSpeed / 3 }),
        withTiming(0, { duration: fallSpeed / 3 }),
      ),
    )

    rotate.value = withDelay(delay, withTiming(rotationDirection * 360, { duration: fallSpeed }))

    // Fade out at the end
    opacity.value = withDelay(delay + fallSpeed - 500, withTiming(0, { duration: 500 }))

    // Random scaling
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(Math.random() * 0.5 + 0.8, { duration: 300 }),
        withTiming(Math.random() * 0.5 + 0.8, { duration: 300 }),
        withTiming(Math.random() * 0.5 + 0.8, { duration: 300 }),
      ),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    }
  })

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          width: size,
          height: size * 3,
          left: startX,
          top: -20,
        },
        animatedStyle,
      ]}
    />
  )
}

export default function Confetti() {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
        <ConfettiPiece key={index} index={index} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  confettiPiece: {
    position: "absolute",
    borderRadius: 2,
  },
})
