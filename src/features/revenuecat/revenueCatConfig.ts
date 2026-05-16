import { Platform } from "react-native";
import { ProductId } from "@/features/access/accessTypes";

export const REVENUECAT_ENTITLEMENTS = {
  baseGame: "base_game",
} as const satisfies Record<string, ProductId>;

export const REVENUECAT_OFFERINGS = {
  default: "default",
} as const;

export const REVENUECAT_PACKAGES = {
  baseGame: "base_game",
} as const;

export const APP_STORE_PRODUCT_IDS = {
  baseGame: "deepend_base_game",
} as const;

export function shouldUseRevenueCat(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_REVENUECAT === "true";
}

export function getRevenueCatApiKey(): string | null {
  if (!shouldUseRevenueCat()) {
    return null;
  }

  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? null;
  }

  return null;
}
export function shouldShowDevPurchaseControls(): boolean {
  return process.env.EXPO_PUBLIC_SHOW_DEV_PURCHASE_CONTROLS === "true";
}