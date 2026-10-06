import { DonationItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DonationRecord {
  id: number;
  foodType: string;
  quantityKg: number;
  preparedAt: string;
  bestBeforeAt: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  status: DonationItem['status'];
  category: string | null;
  allergens: string | null;
  images: string | null;
  servings: number | null;
  createdAt: string;
  donorOrganizationId: number;
  donorOrganizationName: string;
  donorOrganizationAddress: string | null;
  donorOrganizationLatitude: number;
  donorOrganizationLongitude: number;
}

export interface CreateDonationPayload {
  foodType: string;
  quantityKg: number;
  preparedAt: string;
  bestBeforeAt: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  servings: number;
  category: string;
  allergens: string;
  images: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success) {
    throw new Error(result.message || `API request failed (${response.status})`);
  }
  return result.data;
}

export function getDonations(): Promise<DonationRecord[]> {
  return request<DonationRecord[]>('/donations');
}

export function createDonation(donorOrganizationId: number, payload: CreateDonationPayload): Promise<DonationRecord> {
  return request<DonationRecord>(`/donations?donorOrgId=${donorOrganizationId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createClaim(donationId: number, ngoOrganizationId: number): Promise<unknown> {
  return request(`/claims?donationId=${donationId}&ngoOrgId=${ngoOrganizationId}`, {
    method: 'POST',
  });
}

export function toDonationItem(record: DonationRecord): DonationItem {
  const bestBefore = new Date(record.bestBeforeAt);
  const remainingMinutes = Math.max(0, Math.floor((bestBefore.getTime() - Date.now()) / 60000));
  const images = record.images ? parseStringList(record.images) : [];
  const tags = record.allergens ? record.allergens.split(',').map((tag) => tag.trim()).filter(Boolean) : [];
  const category = record.category;

  return {
    id: String(record.id),
    donorOrg: {
      id: String(record.donorOrganizationId),
      name: record.donorOrganizationName,
      address: record.donorOrganizationAddress || record.pickupAddress,
      phone: '',
      verifiedKitchen: true,
    },
    title: `${record.servings ?? Math.round(record.quantityKg * 2.5)} Servings (approx. ${record.quantityKg} kg)`,
    description: record.foodType,
    category: category === 'Bakery' || category === 'Packaged' || category === 'Raw Produce' ? category : 'Cooked Meal',
    quantityKg: record.quantityKg,
    servings: record.servings ?? Math.round(record.quantityKg * 2.5),
    co2SavedKg: Number((record.quantityKg * 2.6).toFixed(1)),
    preparedAt: new Date(record.preparedAt).toLocaleString(),
    bestBeforeAt: bestBefore.toLocaleString(),
    expiresInText: remainingMinutes > 0 ? `Expires in ${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m` : 'Pickup window passed',
    isUrgent: remainingMinutes <= 120,
    distanceKm: 0,
    pickupAddress: record.pickupAddress,
    pickupLatitude: record.pickupLatitude,
    pickupLongitude: record.pickupLongitude,
    storageType: category || 'Food donation',
    logisticsNote: 'Coordinate pickup with the donor organization',
    dietaryTags: tags,
    status: record.status,
    images,
    createdAt: record.createdAt,
  };
}

function parseStringList(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
}