import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native"
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated"
import { useAudio } from "../context/AudioContext"

interface BoardProps {
  board: (string | null)[][]
  boardSize: number
  onCellPress: (row: number, col: number) => void
  winningCells: [number, number][]
  disabled: boolean
}

export default function Board({ board, boardSize, onCellPress, winningCells, disabled }: BoardProps) {
  const screenWidth = Dimensions.get("window").width
  const boardWidth = Math.min(screenWidth - 40, 350) // Max board width
  const cellSize = boardWidth / boardSize

  const isCellWinning = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  return (
    <Animated.View style={[styles.board, { width: boardWidth, height: boardWidth }]} entering={ZoomIn.duration(500)}>
      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              value={cell}
              size={cellSize}
              isWinning={isCellWinning(rowIndex, colIndex)}
              onPress={() => onCellPress(rowIndex, colIndex)}
              disabled={cell !== null || disabled}
              rowIndex={rowIndex}
              colIndex={colIndex}
              boardSize={boardSize}
              delay={(rowIndex * boardSize + colIndex) * 50}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  )
}

interface CellProps {
  value: string | null
  size: number
  isWinning: boolean
  onPress: () => void
  disabled: boolean
  rowIndex: number
  colIndex: number
  boardSize: number
  delay: number
}

function Cell({ value, size, isWinning, onPress, disabled, rowIndex, colIndex, boardSize, delay }: CellProps) {
  const scale = useSharedValue(1)
  const { playSound } = useAudio()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const handlePress = () => {
    scale.value = withSequence(withTiming(0.9, { duration: 100 }), withTiming(1, { duration: 100 }))
    onPress()
  }

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(300)}
      style={[
        styles.cellContainer,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.cell,
          {
            width: size - 6,
            height: size - 6,
            borderTopWidth: rowIndex === 0 ? 0 : 0,
            borderLeftWidth: colIndex === 0 ? 0 : 0,
            borderRightWidth: colIndex === boardSize - 1 ? 0 : 0,
            borderBottomWidth: rowIndex === boardSize - 1 ? 0 : 0,
          },
          isWinning && styles.winningCell,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
      >
        {value && (
          <Animated.Text
            style={[
              styles.cellText,
              { fontSize: size * 0.5 },
              value === "X" ? styles.xText : styles.oText,
              isWinning && styles.winningCellText,
              animatedStyle,
            ]}
          >
            {value}
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
  },
  cellContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
    margin: 3,
    borderRadius: 8,
  },
  cellText: {
    fontFamily: "Poppins-Bold",
  },
  xText: {
    color: "#ff7675",
  },
  oText: {
    color: "#74b9ff",
  },
  winningCell: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  winningCellText: {
    color: "#4CAF50",
  },
})
