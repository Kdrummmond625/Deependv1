import { ReactNode, useEffect, useRef } from "react";
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
  const isSwiping = useSharedValue(false);

  const onSwipeRightRef = useRef(onSwipeRight);
  const onSwipeLeftRef = useRef(onSwipeLeft);

  useEffect(() => {
    onSwipeRightRef.current = onSwipeRight;
  }, [onSwipeRight]);

  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
  }, [onSwipeLeft]);

  const callSwipeRight = () => {
    onSwipeRightRef.current();
  };

  const callSwipeLeft = () => {
    onSwipeLeftRef.current();
  };

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

    isSwiping.value = false;
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      if (isSwiping.value) return;
      isSwiping.value = true;
    })
    .onUpdate((event) => {
      if (!isSwiping.value) return;

      translateX.value = event.translationX;
      rotateZ.value = event.translationX / 28;
    })
    .onEnd((event) => {
      const swipedRight = event.translationX > SWIPE_THRESHOLD;
      const swipedLeft = event.translationX < -SWIPE_THRESHOLD;

      if (swipedRight) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 160 }, () => {
          runOnJS(callSwipeRight)();
          translateX.value = 0;
          rotateZ.value = 0;
          isSwiping.value = false;
        });
        return;
      }

      if (swipedLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 160 }, () => {
          runOnJS(callSwipeLeft)();
          translateX.value = 0;
          rotateZ.value = 0;
          isSwiping.value = false;
        });
        return;
      }

      resetCard();
    })
    .onFinalize(() => {
      if (Math.abs(translateX.value) < SWIPE_THRESHOLD) {
        resetCard();
      }
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