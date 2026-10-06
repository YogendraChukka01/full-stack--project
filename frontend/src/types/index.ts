export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

export type DonationCategory = 'Cooked Meal' | 'Packaged' | 'Bakery' | 'Raw Produce';

export type DonationStatus = 'AVAILABLE' | 'CLAIMED' | 'PICKED_UP' | 'DELIVERED' | 'DISTRIBUTED' | 'CANCELLED';

export interface DonationItem {
  id: string;
  donorOrg: {
    id: string;
    name: string;
    address: string;
    phone: string;
    verifiedKitchen: boolean;
  };
  title: string;
  description: string;
  category: DonationCategory;
  quantityKg: number;
  servings: number;
  co2SavedKg: number;
  preparedAt: string;
  bestBeforeAt: string;
  expiresInText: string;
  isUrgent: boolean;
  distanceKm: number;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  storageType: string; // e.g. "Cooked Hot (Prepared 2:00 PM)", "Ambient Storage (Dry)"
  logisticsNote: string; // e.g. "Insulated Bags Recommended", "Bulk Cargo (Van Recommended)"
  dietaryTags: string[]; // e.g. ["100% Vegetarian", "Contains Dairy"]
  status: DonationStatus;
  images: string[];
  pickupNote?: string;
  claimedBy?: {
    ngoName: string;
    claimedAt: string;
    assignedDriver?: string;
  };
  createdAt: string;
}

export type TaskStatus = 'EN_ROUTE_PICKUP' | 'PICKED_UP' | 'EN_ROUTE_DELIVERY' | 'COMPLETED';

export interface RescueMissionTask {
  id: string;
  donationId: string;
  donorName: string;
  donorAddress: string;
  donorPhone: string;
  donorNotes: string;
  recipientOrg: string;
  recipientAddress: string;
  recipientContact: string;
  recipientPhone: string;
  recipientPhotoUrl: string;
  gateAccessCode: string;
  dropoffInstructions: string;
  distanceTotalKm: number;
  etaMinutes: number;
  manifestDescription: string;
  weightKg: number;
  storageSpecs: string;
  safeWindowText: string;
  status: TaskStatus;
  pickupCompleted: boolean;
  pickupTime?: string;
  podOtp?: string;
  podPhotoUrl?: string;
  podSignature?: string;
  completedAt?: string;
}

export interface VerificationAuditItem {
  id: string;
  name: string;
  type: 'NGO' | 'Donor';
  typeLabel: string;
  credentials: string[];
  coldStorageCapacity?: string;
  dailySurplus?: string;
  coldChainLog?: string;
  submittedAgo: string;
  status: 'AWAITING_ACTION' | 'PENDING_REVIEW' | 'DOCS_REUPLOADED' | 'APPROVED';
  docFileName: string;
  docFileSize: string;
  fssaiNumber: string;
  imageUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'urgent' | 'claim' | 'dispatch' | 'verified';
  linkTab?: string;
}
