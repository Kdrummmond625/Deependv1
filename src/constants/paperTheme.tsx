import { Platform } from "react-native";

export const paperColors = {
  ink: "#071512",

  paper: "#F4EBDD",
  paperLight: "#FAF3E5",
  paperMuted: "#E8DDC8",
  paperDust: "#CBBFAE",

  terracotta: "#B86A4B",
  terracottaLight: "#C77757",

  gold: "#C8A75D",
  goldLight: "#D8BD75",

  moss: "#486B55",
  clay: "#D19A73",
  roseDust: "#C98C7A",

  danger: "#B84A3A",
};

export const paperSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 32,
};

export const paperRadii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 28,
  pill: 999,
};

export const paperFonts = {
  serif: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "serif",
  }),
};

export const paperType = {
  brandSmall: {
    fontSize: 14,
    letterSpacing: 1.4,
    fontWeight: "600" as const,
  },
  screenTitle: {
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "500" as const,
  },
  prompt: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "500" as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "700" as const,
  },
  button: {
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "700" as const,
  },
};