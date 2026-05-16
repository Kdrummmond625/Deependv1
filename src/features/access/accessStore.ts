import { create } from "zustand";
import { AccessState, ProductId } from "./accessTypes";
import {
  getUnlockedProductIds,
  saveUnlockedProductIds,
} from "./accessStorage";
import { BASE_GAME_PRODUCT_ID } from "./accessRules";
import { shouldUseRevenueCat } from "@/features/revenuecat/revenueCatConfig";

export const useAccessStore = create<AccessState>((set, get) => ({
  unlockedProductIds: [],
  hasHydratedAccess: false,
  isSyncingRevenueCatAccess: false,

  hydrateAccess: async () => {
    if (get().hasHydratedAccess) return;

    const unlockedProductIds = await getUnlockedProductIds();

    set({
      unlockedProductIds,
      hasHydratedAccess: true,
    });
  },

  syncRevenueCatAccess: async () => {
    if (!shouldUseRevenueCat()) return;

    set({
      isSyncingRevenueCatAccess: true,
    });

    try {
      const { customerHasBaseGameAccess } = await import(
        "@/features/revenuecat/revenueCatService"
      );

      const hasBaseGameAccess = await customerHasBaseGameAccess();

      if (!hasBaseGameAccess) return;

      const currentProductIds = get().unlockedProductIds;

      if (currentProductIds.includes(BASE_GAME_PRODUCT_ID)) return;

      const nextProductIds = [...currentProductIds, BASE_GAME_PRODUCT_ID];

      set({
        unlockedProductIds: nextProductIds,
      });

      await saveUnlockedProductIds(nextProductIds);
    } finally {
      set({
        isSyncingRevenueCatAccess: false,
      });
    }
  },

  unlockProduct: (productId: ProductId) => {
    const currentProductIds = get().unlockedProductIds;

    if (currentProductIds.includes(productId)) return;

    const nextProductIds = [...currentProductIds, productId];

    set({
      unlockedProductIds: nextProductIds,
    });

    void saveUnlockedProductIds(nextProductIds);
  },

  lockProduct: (productId: ProductId) => {
    const nextProductIds = get().unlockedProductIds.filter(
      (id) => id !== productId
    );

    set({
      unlockedProductIds: nextProductIds,
    });

    void saveUnlockedProductIds(nextProductIds);
  },

  hasUnlockedProduct: (productId: ProductId) => {
    return get().unlockedProductIds.includes(productId);
  },
}));