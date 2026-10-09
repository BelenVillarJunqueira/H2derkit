export type PaymentMethodType = 'mercadopago' | 'contraentrega' | 'transferencia';

export type PaymentStatusType = 'pending' | 'paid' | 'failed';

export type ShippingStatusType = 
  | 'confirmed'     // Pedido recibido y confirmado
  | 'preparing'     // En preparación en laboratorio
  | 'shipped'       // Despachado / Recolectado por correo
  | 'in_transit'    // En camino / En reparto a domicilio
  | 'delivered'     // Entregado al cliente
  | 'cancelled';    // Cancelado

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  badge?: string;
  thumbnail?: string;
  duration?: string;
}

export interface RoutineStep {
  number: string;
  title: string;
  subtitle: string;
  time: string;
  image: string;
  description: string;
  benefits: string[];
}

export interface ClinicalStat {
  percentage: string;
  badge?: string;
  title: string;
  description: string;
}

export interface ProblemSolutionItem {
  problemName: string;
  problemDescription: string;
  solutionName: string;
  solutionDescription: string;
}

export interface ActiveIngredientItem {
  name: string;
  type: string;
  benefit: string;
  tag: string;
}

export interface ProductPack {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  isPopular?: boolean;
  quantity: number;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  savings: number;
  freeGift?: string;
  features: string[];
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  verified: boolean;
  city: string;
  title: string;
  comment: string;
  photoUrl?: string;
  likes: number;
}

export interface OrderItem {
  id: string;
  trackingCode: string;
  customerName: string;
  email: string;
  phone: string;
  dni: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryNotes?: string;
  packId: string;
  packTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  shippingStatus: ShippingStatusType;
  carrier: string;
  statusHistory: {
    status: ShippingStatusType;
    title: string;
    description: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
  paymentProofUrl?: string;
  mercadoPagoDetails?: {
    paymentId?: string;
    cardLast4?: string;
    cardBrand?: string;
    installments?: number;
  };
}

export interface PaymentGatewaysSettings {
  mercadoPago: {
    enabled: boolean;
    publicKey: string;
    accessToken: string;
    mode: 'sandbox' | 'production';
    maxInstallments: number;
    offerCuotasSinInteres: boolean;
  };
  contraentrega: {
    enabled: boolean;
    title: string;
    description: string;
    extraFee: number;
  };
  transferencia: {
    enabled: boolean;
    bankName: string;
    accountHolder: string;
    cbu: string;
    cvu: string;
    alias: string;
    cuit: string;
    extraDiscountPercent: number;
    instructions: string;
  };
}

export interface StoreContent {
  announcementText: string;
  announcementSubtext: string;
  brandName: string;
  productKicker: string;
  productTitle: string;
  productTagline: string;
  ratingScore: number;
  ratingCount: number;
  stockRemaining: number;
  viewersCount: number;
  countdownMinutes: number;
  currencySymbol: string;
  currencyCode: string;
  
  // Packs configuration
  packs: ProductPack[];

  // Trust badges & guarantees
  guaranteeDays: number;
  guaranteeTitle: string;
  guaranteeText: string;
  shippingPromise: string;
  
  // Problem & Solution
  problemTitle: string;
  problemSubtitle: string;
  solutionTitle: string;
  solutionSubtitle: string;
  
  // Before & After texts & images
  beforeAfterTitle: string;
  beforeAfterSubtitle: string;
  beforeLabel: string;
  afterLabel: string;
  beforeDescription: string;
  afterDescription: string;
  beforeImage: string;
  afterImage: string;
  clinicalStats: ClinicalStat[];
  
  // Routine texts & steps
  routineTitle: string;
  routineSubtitle: string;
  routineSteps: RoutineStep[];

  // Problems & Ingredients
  problemItems: ProblemSolutionItem[];
  activeIngredients: ActiveIngredientItem[];
  dermatologistDoctorName: string;
  dermatologistQuote: string;
  dermatologistPhoto: string;

  // Shipping & Timings
  shippingEstimatedDays: string;
  freeShippingThresholdText: string;

  // Contact & Social
  whatsappNumber: string;
  supportEmail: string;
  supportPhone: string;
  shippingCarriersText: string;
  updatedAt?: number;
}

export interface StoreAnalytics {
  totalVisits: number;
  addToCartCount: number;
  initiatedCheckouts: number;
  completedOrders: number;
  totalRevenue: number;
  dailyVisits: { date: string; visits: number; sales: number }[];
}
