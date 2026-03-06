import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_USER: '@bharatbazaar_auth_user',
  STORE_PROFILE: '@bharatbazaar_store_profile',
  INVENTORY: '@bharatbazaar_inventory',
  INVOICES: '@bharatbazaar_invoices',
  SETTINGS: '@bharatbazaar_settings',
  ONBOARDING_DONE: '@bharatbazaar_onboarding_done',
};

export interface UserData {
  phone: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
}

export interface StoreProfile {
  storeName: string;
  ownerName: string;
  phone: string;
  city: string;
  gstin: string;
  categories: string[];
  language: string;
}

export interface InvoiceRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; qty: number; rate: number; gstPercent: number; hsn: string }[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  units: number;
  costPrice: number;
  sellPrice: number;
  margin: number;
  status: string;
  source: string;
  updated: string;
}

export interface AppSettings {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  hapticFeedback: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  language: 'hi',
  notifications: true,
  hapticFeedback: true,
};

// Auth
export const saveUser = async (user: UserData) => {
  await AsyncStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
};

export const getUser = async (): Promise<UserData | null> => {
  const data = await AsyncStorage.getItem(KEYS.AUTH_USER);
  return data ? JSON.parse(data) : null;
};

export const removeUser = async () => {
  await AsyncStorage.removeItem(KEYS.AUTH_USER);
};

// Store Profile
export const saveStoreProfile = async (profile: StoreProfile) => {
  await AsyncStorage.setItem(KEYS.STORE_PROFILE, JSON.stringify(profile));
};

export const getStoreProfile = async (): Promise<StoreProfile | null> => {
  const data = await AsyncStorage.getItem(KEYS.STORE_PROFILE);
  return data ? JSON.parse(data) : null;
};

// Inventory
export const saveInventory = async (items: InventoryItem[]) => {
  await AsyncStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  const data = await AsyncStorage.getItem(KEYS.INVENTORY);
  return data ? JSON.parse(data) : [];
};

export const addInventoryItems = async (newItems: InventoryItem[]) => {
  const existing = await getInventory();
  const merged = [...existing];
  for (const item of newItems) {
    const idx = merged.findIndex(e => e.name === item.name);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], units: merged[idx].units + item.units, updated: 'just now' };
    } else {
      merged.push(item);
    }
  }
  await saveInventory(merged);
  return merged;
};

// Invoices
export const saveInvoice = async (invoice: InvoiceRecord) => {
  const existing = await getInvoices();
  existing.unshift(invoice);
  await AsyncStorage.setItem(KEYS.INVOICES, JSON.stringify(existing));
};

export const getInvoices = async (): Promise<InvoiceRecord[]> => {
  const data = await AsyncStorage.getItem(KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
};

// Settings
export const saveSettings = async (settings: AppSettings) => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = async (): Promise<AppSettings> => {
  const data = await AsyncStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

// Onboarding
export const setOnboardingDone = async () => {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
};

export const isOnboardingDone = async (): Promise<boolean> => {
  const data = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return data === 'true';
};

// Clear all data (for logout)
export const clearAllData = async () => {
  await AsyncStorage.multiRemove(Object.values(KEYS));
};
