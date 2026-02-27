/* ===== Service Layer ===== */
/* Responsibility: Handle coupon fetching API operations */

/* ===== Imports ===== */
import axios from 'axios';

/* ===== Configuration ===== */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/* ===== Public Interfaces ===== */
export interface Coupon {
  id: string;
  title: string;
  brand: string;
  image_url: string;
  valid_until: string;
  description?: string;
  [key: string]: any;
}

/* ===== API Functions ===== */
/**
 * Fetch all available coupons from the API
 * @returns Promise<Coupon[]> - Array of coupon objects
 * @throws Error when API call fails
 */
export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const response = await axios.get(`${API_URL}/coupons`);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    throw new Error("Unable to fetch coupons. Please try again later.");
  }
}
