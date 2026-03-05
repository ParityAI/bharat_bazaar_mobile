// Mock Data for BharatBazaar AI

export const storeOwner = {
  name: 'Rajesh',
  storeName: 'Rajesh General Store',
  city: 'Lucknow',
  gstin: '09XXXXX1234X1Z5',
};

export const dashboardStats = {
  todayRevenue: 12850,
  todayRevenueChange: 18,
  itemsSold: 47,
  weeklyRevenue: 78420,
};

export const aiInsight = {
  icon: '🌧️',
  message: 'Rain forecast tomorrow — consider stocking 20% more Dal & Rice. Demand typically rises 15% during monsoon.',
};

export const topSellers = [
  { id: '1', name: 'Basmati Rice 5kg', sold: 12, revenue: 4560 },
  { id: '2', name: 'Toor Dal 1kg', sold: 8, revenue: 1240 },
  { id: '3', name: 'Surf Excel 1kg', sold: 6, revenue: 1350 },
];

export const festivalAlert = {
  festival: 'Diwali',
  daysAway: 12,
  impact: 'High',
  suggestion: 'Stock sweets & dry fruits.',
};

export const scannedItems = [
  { id: '1', name: 'Basmati Rice 5kg', quantity: 10, unitPrice: 280, total: 2800, selected: true },
  { id: '2', name: 'Toor Dal 1kg', quantity: 20, unitPrice: 120, total: 2400, selected: true },
  { id: '3', name: 'Sugar 1kg', quantity: 15, unitPrice: 42, total: 630, selected: true },
  { id: '4', name: 'Maggi 4-pack', quantity: 30, unitPrice: 48, total: 1440, selected: true },
  { id: '5', name: 'Amul Butter 500g', quantity: 10, unitPrice: 270, total: 2700, selected: true },
];

export const pricingStrategies = [
  {
    id: 'competitive',
    name: 'COMPETITIVE',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    price: 335,
    margin: 19.6,
    description: 'Match market leaders, volume-driven',
    confidence: 87,
  },
  {
    id: 'balanced',
    name: 'BALANCED',
    color: '#22C55E',
    bgColor: '#DCFCE7',
    price: 365,
    margin: 30.4,
    description: 'Optimal price-to-value ratio',
    confidence: 92,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    price: 399,
    margin: 42.5,
    description: 'Position as quality leader',
    confidence: 78,
  },
];

export const competitorPrices = {
  amazon: 389,
  bigBasket: 345,
  localAvg: 355,
};

export const products = [
  { id: '1', name: 'Basmati Rice 5kg', costPrice: 280, sellingPrice: 350 },
  { id: '2', name: 'Toor Dal 1kg', costPrice: 120, sellingPrice: 155 },
  { id: '3', name: 'Sugar 1kg', costPrice: 42, sellingPrice: 50 },
  { id: '4', name: 'Surf Excel 1kg', costPrice: 180, sellingPrice: 225 },
  { id: '5', name: 'Amul Butter 500g', costPrice: 230, sellingPrice: 270 },
];

export const cities = [
  'Lucknow',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Jaipur',
  'Ahmedabad',
];

export const chatMessages = [
  {
    id: '1',
    type: 'user' as const,
    message: 'Rice ka daam kya hai aaj?',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'ai' as const,
    message: 'Rajesh ji, Basmati Rice 5kg ki market price:\n• Amazon: ₹389\n• BigBasket: ₹345\n• Local avg: ₹355\n\nAapka price ₹350 competitive hai! 👍\nDiwali ke liye ₹375-380 consider karein.',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'user' as const,
    message: 'Mausam kaisa rahega?',
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'ai' as const,
    message: '🌧️ Lucknow mein kal se barish ka forecast hai.\n\nBusiness Impact:\n• Dal demand +15% ↑\n• Rice demand +12% ↑\n\nSuggestion: Extra stock rakhein dry goods ka',
    timestamp: new Date(),
  },
];

export const languageOptions = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'ta', label: 'தமி' },
  { code: 'bn', label: 'বাং' },
  { code: 'gu', label: 'ગુજ' },
  { code: 'mr', label: 'मरा' },
];

export const quickChips = ['Stock check', "Today's sales", 'Price suggestion'];

export const invoiceItems = [
  { id: '1', name: 'Basmati Rice 5kg', qty: 2, rate: 365, gstPercent: 5 },
  { id: '2', name: 'Toor Dal 1kg', qty: 3, rate: 155, gstPercent: 5 },
  { id: '3', name: 'Surf Excel 1kg', qty: 1, rate: 225, gstPercent: 18 },
];
