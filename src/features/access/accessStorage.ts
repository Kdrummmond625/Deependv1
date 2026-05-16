import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductId } from "./accessTypes";

const UNLOCKED_PRODUCTS_KEY = "deep_end_unlocked_product_ids";

function isProductId(value: unknown): value is ProductId {
  return value === "base_game";
}

export async function getUnlockedProductIds(): Promise<ProductId[]> {
  const rawValue = await AsyncStorage.getItem(UNLOCKED_PRODUCTS_KEY);

  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isProductId);
  } catch {
    return [];
  }
}

export async function saveUnlockedProductIds(
  productIds: ProductId[]
): Promise<void> {
  await AsyncStorage.setItem(
    UNLOCKED_PRODUCTS_KEY,
    JSON.stringify(productIds)
  );
}