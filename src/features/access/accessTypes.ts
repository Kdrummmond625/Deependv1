export type ProductId = "base_game";

export type AccessState = {
  unlockedProductIds: ProductId[];
  unlockProduct: (productId: ProductId) => void;
  lockProduct: (productId: ProductId) => void;
  hasUnlockedProduct: (productId: ProductId) => boolean;

  hydrateAccess: () => Promise<void>;
  hasHydratedAccess: boolean;

  syncRevenueCatAccess: () => Promise<void>;
  isSyncingRevenueCatAccess: boolean;
};