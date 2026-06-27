/**
 * localStorage utility helpers for Vitalis Beauty Commerce
 * All data persistence is handled here — ready to migrate to Supabase later
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: string;
  role: 'customer' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  ingredients?: string;
  image: string;
  badge?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  invoiceNumber: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
}

// ── Keys ──────────────────────────────────────────────
const KEYS = {
  users: 'vitalis_users',
  currentUser: 'vitalis_current_user',
  cart: 'vitalis_cart',
  orders: 'vitalis_orders',
  products: 'vitalis_products',
  initialized: 'vitalis_initialized',
};

// ── Generic helpers ───────────────────────────────────
function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — ignore silently
  }
}

// ── Seed Products ─────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Vitalis EDP Juicy Luxe',
    category: 'Eau de Parfum',
    price: 119000,
    originalPrice: 149000,
    stock: 48,
    rating: 4.8,
    reviewCount: 324,
    description:
      'Aroma cherry blossom berpadu orange dan plum yang fruity manis segar. Middle notes green mandarin, sambac jasmine, lily of the valley, dan rose yang floral segar elegan. Base notes sandalwood, caramel, praline, dan musky hangat yang tahan lama.',
    ingredients:
      'Alcohol Denat, Aqua, Parfum, Limonene, Linalool, Citronellol, Geraniol, Coumarin, Benzyl Benzoate',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_186227c70-1778763537761.png',
    badge: 'Best Seller',
    isBestSeller: true,
    variants: ['30ml', '60ml'],
  },
  {
    id: 'prod_002',
    name: 'Vitalis EDP Glam Slay',
    category: 'Eau de Parfum',
    price: 129000,
    originalPrice: 159000,
    stock: 32,
    rating: 4.7,
    reviewCount: 218,
    description:
      'Aroma bergamot dan berries yang segar, manis, dan ceria. Middle notes jasmine, orris, dan peony yang floral lembut elegan. Base notes heliotrope, musk, dan vanilla yang hangat, creamy, dan menenangkan.',
    ingredients: 'Alcohol Denat, Aqua, Parfum, Limonene, Linalool, Benzyl Alcohol, Citral, Eugenol',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_186227c70-1778763537761.png',
    badge: 'New',
    isNew: true,
    variants: ['30ml', '60ml'],
  },
  {
    id: 'prod_003',
    name: 'Vitalis Eau de Royale Charming Majesty',
    category: 'Eau de Parfum',
    price: 139000,
    originalPrice: 179000,
    stock: 25,
    rating: 4.9,
    reviewCount: 156,
    description:
      'EDP dengan wangi mewah berkarakter floral, woody, musky, vanilla, dan powdery. Menghadirkan parfum berkualitas internasional dengan Joyful Inside Scent™ yang membangkitkan semangat, energi, dan optimisme.',
    ingredients:
      'Alcohol Denat, Aqua, Parfum, Linalool, Limonene, Citronellol, Geraniol, Alpha-Isomethyl Ionone',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_186227c70-1778763537761.png',
    badge: 'Premium',
    isBestSeller: true,
    variants: ['30ml', '60ml'],
  },
  {
    id: 'prod_004',
    name: 'Vitalis Perfumed Body Wash Soft Beauty',
    category: 'Body Wash',
    price: 32000,
    originalPrice: 38000,
    stock: 120,
    rating: 4.6,
    reviewCount: 489,
    description:
      'Diperkaya dengan ekstrak Avocado dan Vitamin E untuk menutrisi kulit tetap elastis dan lembut. Wangi segar Fruity Aldehydic, dilanjutkan Rose dan Violet yang feminine, diakhiri Tonka Bean dan Sandalwood yang premium.',
    ingredients:
      'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Parfum, Avocado Extract, Vitamin E',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19cbcd125-1774253158352.png',
    badge: 'Best Seller',
    isBestSeller: true,
    variants: ['250ml', '400ml'],
  },
  {
    id: 'prod_005',
    name: 'Vitalis Perfumed Body Wash Fresh Dazzle',
    category: 'Body Wash',
    price: 32000,
    originalPrice: 38000,
    stock: 95,
    rating: 4.5,
    reviewCount: 312,
    description:
      'Dibuka dengan segarnya wangi Bergamot, diikuti Floral bouquet yang elegan, ditutup Musk Amber yang long lasting. Diperkaya ekstrak Yuzu Orange dan Green Tea untuk kulit bercahaya.',
    ingredients:
      'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Parfum, Yuzu Orange Extract, Green Tea Extract',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d891b7b2-1772607226303.png',
    isNew: true,
    badge: 'New',
    variants: ['250ml', '400ml'],
  },
  {
    id: 'prod_006',
    name: 'Vitalis Body Scent Glamour Sheer',
    category: 'Body Scent',
    price: 45000,
    originalPrice: 55000,
    stock: 67,
    rating: 4.4,
    reviewCount: 203,
    description:
      'Pancarkan inner beauty dan aura glamor dengan wangi fresh dan tahan lama. Kombinasi orange, pear, dan rose yang manis membuat tubuh wangi sepanjang hari.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_16186a581-1773324908639.png',
    variants: ['100ml'],
  },
  {
    id: 'prod_007',
    name: 'Vitalis Body Scent Glamour Fantasy',
    category: 'Body Scent',
    price: 48000,
    originalPrice: 58000,
    stock: 54,
    rating: 4.6,
    reviewCount: 178,
    description:
      'Menghadirkan fantasi kehidupan glamor dengan kombinasi citrus mandarin dan pear yang segar, diikuti wangi floral-powdery-musky yang lembut, feminine, dan sensasional.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_14c09d281-1777015638214.png',
    badge: 'Popular',
    variants: ['100ml'],
  },
  {
    id: 'prod_008',
    name: 'Vitalis Deodorant Roll-On Silky Breeze',
    category: 'Deodorant',
    price: 22000,
    originalPrice: 28000,
    stock: 200,
    rating: 4.3,
    reviewCount: 567,
    description:
      'Perlindungan 48 jam dari bau badan dengan wangi Silky Breeze yang segar dan feminin. Formula gentle cocok untuk kulit sensitif, tidak meninggalkan bekas putih.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1943b7a1a-1766408760486.png',
    isBestSeller: true,
    badge: 'Best Seller',
    variants: ['50ml'],
  },
];

// ── Initialization ─────────────────────────────────────
export function initializeStore(): void {
  if (typeof window === 'undefined') return;
  if (get<boolean>(KEYS.initialized)) return;

  // Seed products
  set(KEYS.products, SEED_PRODUCTS);

  // Seed admin user
  const adminUser: User = {
    id: 'admin_001',
    name: 'Admin Vitalis',
    email: 'admin@vitalis.com',
    password: 'admin123',
    verified: true,
    createdAt: new Date().toISOString(),
    role: 'admin',
  };
  set(KEYS.users, [adminUser]);

  // Seed demo orders
  const demoOrders: Order[] = [
    {
      id: 'ord_demo_001',
      userId: 'user_demo',
      userName: 'Sari Dewi',
      userEmail: 'sari.dewi@email.com',
      items: [
        {
          productId: 'prod_001',
          productName: 'Vitalis EDP Juicy Luxe',
          price: 119000,
          quantity: 2,
          image: SEED_PRODUCTS[0].image,
        },
        {
          productId: 'prod_004',
          productName: 'Vitalis Perfumed Body Wash Soft Beauty',
          price: 32000,
          quantity: 1,
          image: SEED_PRODUCTS[3].image,
        },
      ],

      subtotal: 270000,
      shipping: 15000,
      total: 285000,
      address: {
        fullName: 'Sari Dewi',
        phone: '08123456789',
        street: 'Jl. Sudirman No. 45',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12190',
      },
      paymentMethod: 'QRIS',
      status: 'completed',
      invoiceNumber: 'INV-2026-0001',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord_demo_002',
      userId: 'user_demo2',
      userName: 'Rina Maharani',
      userEmail: 'rina.m@email.com',
      items: [
        {
          productId: 'prod_003',
          productName: 'Vitalis Eau de Royale Charming Majesty',
          price: 139000,
          quantity: 1,
          image: SEED_PRODUCTS[2].image,
        },
      ],

      subtotal: 139000,
      shipping: 15000,
      total: 154000,
      address: {
        fullName: 'Rina Maharani',
        phone: '08987654321',
        street: 'Jl. Gatot Subroto No. 12',
        city: 'Bandung',
        province: 'Jawa Barat',
        postalCode: '40252',
      },
      paymentMethod: 'Bank Transfer',
      status: 'shipped',
      invoiceNumber: 'INV-2026-0002',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  set(KEYS.orders, demoOrders);

  set(KEYS.initialized, true);
}

// ── User helpers ──────────────────────────────────────
export const userStore = {
  getAll: (): User[] => get<User[]>(KEYS.users) ?? [],
  save: (users: User[]) => set(KEYS.users, users),
  findByEmail: (email: string): User | undefined =>
    (get<User[]>(KEYS.users) ?? []).find((u) => u.email.toLowerCase() === email.toLowerCase()),
  add: (user: User) => {
    const users = get<User[]>(KEYS.users) ?? [];
    users.push(user);
    set(KEYS.users, users);
  },
  update: (updated: User) => {
    const users = (get<User[]>(KEYS.users) ?? []).map((u) => (u.id === updated.id ? updated : u));
    set(KEYS.users, users);
  },
  count: (): number => (get<User[]>(KEYS.users) ?? []).filter((u) => u.role === 'customer').length,
};

export const sessionStore = {
  get: (): User | null => get<User>(KEYS.currentUser),
  set: (user: User) => set(KEYS.currentUser, user),
  clear: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(KEYS.currentUser);
  },
};

// ── Product helpers ───────────────────────────────────
export const productStore = {
  getAll: (): Product[] => get<Product[]>(KEYS.products) ?? SEED_PRODUCTS,
  save: (products: Product[]) => set(KEYS.products, products),
  findById: (id: string): Product | undefined =>
    (get<Product[]>(KEYS.products) ?? []).find((p) => p.id === id),
  add: (product: Product) => {
    const products = get<Product[]>(KEYS.products) ?? [];
    products.push(product);
    set(KEYS.products, products);
  },
  update: (updated: Product) => {
    const products = (get<Product[]>(KEYS.products) ?? []).map((p) =>
      p.id === updated.id ? updated : p
    );
    set(KEYS.products, products);
  },
  delete: (id: string) => {
    const products = (get<Product[]>(KEYS.products) ?? []).filter((p) => p.id !== id);
    set(KEYS.products, products);
  },
  decreaseStock: (productId: string, qty: number) => {
    const products = get<Product[]>(KEYS.products) ?? [];
    const idx = products.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      products[idx].stock = Math.max(0, products[idx].stock - qty);
      set(KEYS.products, products);
    }
  },
};

const getCartKey = () => {
  const user = get<User>(KEYS.currentUser);
  return user ? `vitalis_cart_${user.id}` : KEYS.cart;
};

// ── Cart helpers ──────────────────────────────────────
export const cartStore = {
  get: (): CartItem[] => get<CartItem[]>(getCartKey()) ?? [],

  save: (items: CartItem[]) => set(getCartKey(), items),

  add: (productId: string, quantity = 1, variant?: string) => {
    const items = get<CartItem[]>(getCartKey()) ?? [];

    const existing = items.find(
      (i) => i.productId === productId && i.variant === variant
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId, quantity, variant });
    }

    set(getCartKey(), items);
  },

  remove: (productId: string, variant?: string) => {
    const items = (get<CartItem[]>(getCartKey()) ?? []).filter(
      (i) => !(i.productId === productId && i.variant === variant)
    );

    set(getCartKey(), items);
  },

  updateQty: (productId: string, quantity: number, variant?: string) => {
    const items = (get<CartItem[]>(getCartKey()) ?? []).map((i) =>
      i.productId === productId && i.variant === variant
        ? { ...i, quantity }
        : i
    );

    set(getCartKey(), items);
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(getCartKey());
    }
  },

  count: (): number =>
    (get<CartItem[]>(getCartKey()) ?? []).reduce(
      (s, i) => s + i.quantity,
      0
    ),
};

// ── Order helpers ─────────────────────────────────────
export const orderStore = {
  getAll: (): Order[] => get<Order[]>(KEYS.orders) ?? [],
  save: (orders: Order[]) => set(KEYS.orders, orders),
  findById: (id: string): Order | undefined =>
    (get<Order[]>(KEYS.orders) ?? []).find((o) => o.id === id),
  getByUser: (userId: string): Order[] =>
    (get<Order[]>(KEYS.orders) ?? []).filter((o) => o.userId === userId),
  add: (order: Order) => {
    const orders = get<Order[]>(KEYS.orders) ?? [];
    orders.unshift(order);
    set(KEYS.orders, orders);
  },
  update: (updated: Order) => {
    const orders = (get<Order[]>(KEYS.orders) ?? []).map((o) =>
      o.id === updated.id ? updated : o
    );
    set(KEYS.orders, orders);
  },
  generateInvoiceNumber: (): string => {
    const orders = get<Order[]>(KEYS.orders) ?? [];
    const year = new Date().getFullYear();
    const num = String(orders.length + 1).padStart(4, '0');
    return `INV-${year}-${num}`;
  },
  totalRevenue: (): number =>
    (get<Order[]>(KEYS.orders) ?? [])
      .filter((o) => o.status !== 'pending')
      .reduce((s, o) => s + o.total, 0),
};

// ── Format helpers ────────────────────────────────────
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
