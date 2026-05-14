import { ReactNode } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.22;

type SwipeableCardProps = {
  children: ReactNode;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
};

export function SwipeableCard({
  children,
  onSwipeRight,
  onSwipeLeft,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const resetCard = () => {
    "worklet";

    translateX.value = withSpring(0, {
      damping: 18,
      stiffness: 180,
    });

    rotateZ.value = withSpring(0, {
      damping: 18,
      stiffness: 180,
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotateZ.value = event.translationX / 28;
    })
    .onEnd((event) => {
      const swipedRight = event.translationX > SWIPE_THRESHOLD;
      const swipedLeft = event.translationX < -SWIPE_THRESHOLD;

      if (swipedRight) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 180 }, () => {
          runOnJS(onSwipeRight)();
          translateX.value = 0;
          rotateZ.value = 0;
        });
        return;
      }

      if (swipedLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 180 }, () => {
          runOnJS(onSwipeLeft)();
          translateX.value = 0;
          rotateZ.value = 0;
        });
        return;
      }

      resetCard();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
});