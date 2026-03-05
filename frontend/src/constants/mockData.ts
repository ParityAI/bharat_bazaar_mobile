// Mock Data for BharatBazaar AI - Premium Demo

export const storeOwner = {
  name: 'Sharma',
  storeName: 'Sharma Kirana Store',
  city: 'Lucknow',
  gstin: '09AXXXX1234X1Z5',
  phone: '+91 98765 43210',
};

export const dashboardStats = {
  todayRevenue: 12850,
  todayRevenueChange: 18,
  itemsSold: 47,
  lowStock: 3,
  pendingOrders: 5,
  weeklyRevenue: 78420,
};

export const weeklyChartData = [
  { day: 'Mon', value: 8000 },
  { day: 'Tue', value: 11000 },
  { day: 'Wed', value: 9000 },
  { day: 'Thu', value: 13000 },
  { day: 'Fri', value: 12000 },
  { day: 'Sat', value: 15000 },
  { day: 'Sun', value: 10000 },
];

export const aiInsight = {
  icon: '🌧️',
  message: 'Rain forecast tomorrow — consider stocking 20% more Dal & Rice. Demand typically rises 15% during monsoon.',
};

export const topSellers = [
  { id: '1', name: 'Basmati Rice 5kg', sold: 12, revenue: 4560, emoji: '🏆' },
  { id: '2', name: 'Toor Dal 1kg', sold: 8, revenue: 1240, emoji: '🥈' },
  { id: '3', name: 'Surf Excel 1kg', sold: 6, revenue: 1350, emoji: '🥉' },
  { id: '4', name: 'Parle-G Family Pack', sold: 5, revenue: 1050, emoji: '' },
  { id: '5', name: 'Amul Butter 500g', sold: 4, revenue: 1080, emoji: '' },
];

export const festivalAlert = {
  festival: 'Diwali',
  daysAway: 12,
  impact: 'High',
  suggestion: 'Stock sweets, dry fruits & diyas. Last year sales +45%',
};

export const weatherData = {
  city: 'Lucknow',
  temp: 32,
  condition: 'Partly Cloudy',
  humidity: 78,
  impact: '+12% demand for cold beverages',
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
    emoji: '🎯',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    price: 335,
    margin: 19.6,
    description: 'Match market leaders, volume-driven strategy',
    confidence: 87,
  },
  {
    id: 'balanced',
    name: 'BALANCED',
    emoji: '⚖️',
    color: '#22C55E',
    bgColor: '#DCFCE7',
    price: 365,
    margin: 30.4,
    description: 'Optimal price-to-value ratio for your area',
    confidence: 92,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    emoji: '💎',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    price: 399,
    margin: 42.5,
    description: 'Position as quality leader in locality',
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
  { id: '6', name: 'Maggi 4-pack', costPrice: 48, sellingPrice: 60 },
  { id: '7', name: 'Parle-G Family Pack', costPrice: 55, sellingPrice: 70 },
  { id: '8', name: 'Tata Salt 1kg', costPrice: 22, sellingPrice: 28 },
];

export const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

export const categories = [
  { id: '1', name: 'Groceries', emoji: '🛒', selected: true },
  { id: '2', name: 'FMCG', emoji: '🧴', selected: true },
  { id: '3', name: 'Home Care', emoji: '🧹', selected: false },
  { id: '4', name: 'Snacks', emoji: '🍪', selected: false },
  { id: '5', name: 'Beverages', emoji: '🥤', selected: false },
  { id: '6', name: 'Personal Care', emoji: '💄', selected: false },
  { id: '7', name: 'Electronics', emoji: '⚡', selected: false },
  { id: '8', name: 'Fashion', emoji: '👕', selected: false },
];

export const chatMessages = [
  {
    id: '0',
    type: 'ai' as const,
    message: 'नमस्ते Sharma ji! 🙏\nमैं मुनीम-जी हूँ, आपका AI बिज़नेस एडवाइज़र।\nपूछिए — दाम, स्टॉक, मौसम, कुछ भी!',
    timestamp: new Date(),
  },
  {
    id: '1',
    type: 'user' as const,
    message: 'Rice ka daam kya hai aaj?',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'ai' as const,
    message: 'Rajesh ji, Basmati Rice 5kg market update:\n\n📊 Prices:\n• Amazon: ₹389\n• BigBasket: ₹345\n• Local avg: ₹355\n\nAapka price ₹350 competitive hai! 👍\n\n💡 Diwali ke liye ₹375-380 consider karein — demand +35% expected hai.',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'user' as const,
    message: 'Kal mausam kaisa rahega?',
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'ai' as const,
    message: '🌧️ Lucknow Weather Update:\nKal se barish ka forecast hai.\n\n📈 Business Impact:\n• Dal demand +15% ↑\n• Rice demand +12% ↑\n• Umbrella/raincoat +40% ↑\n\n👉 Extra stock rakhein dry goods ka.\nOrder karna hai toh "order dal" bolein!',
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

export const quickChips = [
  { label: '📊 Price check', action: 'price' },
  { label: '📦 Stock status', action: 'stock' },
  { label: '🌧️ Weather', action: 'weather' },
  { label: '🎪 Festival prep', action: 'festival' },
  { label: "📈 Today's sales", action: 'sales' },
  { label: '🛒 Order stock', action: 'order' },
];

export const invoiceItems = [
  { id: '1', name: 'Basmati Rice 5kg', qty: 2, rate: 365, gstPercent: 5, hsn: '1006' },
  { id: '2', name: 'Toor Dal 1kg', qty: 3, rate: 155, gstPercent: 5, hsn: '0713' },
  { id: '3', name: 'Surf Excel 1kg', qty: 1, rate: 225, gstPercent: 18, hsn: '3402' },
];

export const inventoryItems = [
  { id: '1', name: 'Basmati Rice 5kg', units: 50, costPrice: 280, sellPrice: 365, margin: 30, status: 'ok', source: 'Bill Scan', updated: '2h ago' },
  { id: '2', name: 'Toor Dal 1kg', units: 2, costPrice: 120, sellPrice: 155, margin: 29, status: 'low', source: 'Wholesale', updated: '1d ago' },
  { id: '3', name: 'Surf Excel 1kg', units: 0, costPrice: 180, sellPrice: 225, margin: 25, status: 'out', source: 'WhatsApp', updated: '3d ago' },
  { id: '4', name: 'Parle-G Family Pack', units: 30, costPrice: 55, sellPrice: 70, margin: 27, status: 'ok', source: 'Bill Scan', updated: 'today' },
  { id: '5', name: 'Amul Butter 500g', units: 10, costPrice: 270, sellPrice: 320, margin: 19, status: 'ok', source: 'Manual', updated: '1d ago' },
];

export const notifications = [
  { id: '1', type: 'urgent', time: '2 min ago', message: 'Toor Dal critically low — only 2kg remaining. Reorder from Vijay Wholesale?', action: 'Order' },
  { id: '2', type: 'warning', time: '1 hour ago', message: '🎆 Diwali prep reminder: Stock sweets, dry fruits & decorations. Expected demand +45%', action: null },
  { id: '3', type: 'info', time: '3 hours ago', message: 'Smart pricing update: Consider raising Basmati Rice price to ₹375 due to demand increase', action: null },
  { id: '4', type: 'success', time: 'Yesterday', message: '✅ 5 items added via bill scan — inventory updated', action: null },
  { id: '5', type: 'info', time: 'Yesterday', message: '📊 Weekly report ready: Revenue ₹78,420 (+12%)', action: null },
];

export const onboardingPages = [
  {
    id: 1,
    title: 'Your AI Business Partner',
    description: 'Smart pricing, inventory tracking, and business advice — all in Hindi, on your phone.',
    emoji: '📱',
  },
  {
    id: 2,
    title: '📸 Scan Bills, Skip Data Entry',
    description: 'Photograph your wholesale bill. AI reads Hindi and English text, extracts every item and price. One tap adds to inventory.',
    emoji: '📷',
  },
  {
    id: 3,
    title: '🧮 Munim-ji Speaks Hindi',
    description: 'Ask in Hindi, get answers in Hindi. Voice input supported. Your AI advisor understands festivals, weather, and local markets.',
    emoji: '💬',
  },
  {
    id: 4,
    title: '💰 26% Better Margins',
    description: 'AI analyzes competitors, festivals, weather, and city data to recommend the perfect price for every product.',
    emoji: '📈',
  },
];
