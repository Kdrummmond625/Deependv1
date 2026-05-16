import Purchases from "react-native-purchases";
import {
  getRevenueCatApiKey,
  REVENUECAT_ENTITLEMENTS,
  REVENUECAT_OFFERINGS,
  REVENUECAT_PACKAGES,
} from "./revenueCatConfig";

let revenueCatIsConfigured = false;

export function configureRevenueCat(): boolean {
  if (revenueCatIsConfigured) return true;

  const apiKey = getRevenueCatApiKey();

  if (!apiKey) {
    return false;
  }

  Purchases.configure({
    apiKey,
  });

  revenueCatIsConfigured = true;

  return true;
}

export async function getRevenueCatCustomerInfo() {
  const configured = configureRevenueCat();

  if (!configured) {
    return null;
  }

  return Purchases.getCustomerInfo();
}

export async function customerHasBaseGameAccess(): Promise<boolean> {
  const customerInfo = await getRevenueCatCustomerInfo();

  if (!customerInfo) {
    return false;
  }

  return Boolean(
    customerInfo.entitlements.active[REVENUECAT_ENTITLEMENTS.baseGame]
  );
}

export async function getBaseGamePackage() {
  const configured = configureRevenueCat();

  if (!configured) {
    return null;
  }

  const offerings = await Purchases.getOfferings();
  const defaultOffering = offerings.all[REVENUECAT_OFFERINGS.default];

  if (!defaultOffering) {
    return null;
  }

  const baseGamePackage = defaultOffering.availablePackages.find(
    (item) => item.identifier === REVENUECAT_PACKAGES.baseGame
  );

  return baseGamePackage ?? null;
}

export async function purchaseBaseGame(): Promise<boolean> {
  const baseGamePackage = await getBaseGamePackage();

  if (!baseGamePackage) {
    return false;
  }

  const purchaseResult = await Purchases.purchasePackage(baseGamePackage);

  return Boolean(
    purchaseResult.customerInfo.entitlements.active[
      REVENUECAT_ENTITLEMENTS.baseGame
    ]
  );
}

export async function restoreRevenueCatPurchases(): Promise<boolean> {
  const configured = configureRevenueCat();

  if (!configured) {
    return false;
  }

  const customerInfo = await Purchases.restorePurchases();

  return Boolean(
    customerInfo.entitlements.active[REVENUECAT_ENTITLEMENTS.baseGame]
  );
}