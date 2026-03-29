/* ===== Service Layer ===== */
/* Responsibility: Handle all coupon-related API operations */

/* ===== Imports ===== */
import axios from 'axios';

/* ===== Configuration ===== */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/* ===== Public Interfaces ===== */
export interface UserCoupon {
  id: string;
  profile_id: string;
  coupon_id: string;
  is_used: boolean;
  collected_at: string;
  used_at?: string;
  coupons?: {
    id: string;
    title: string;
    brand: string;
    image_url: string;
    valid_until: string;
    description: string;
    is_active: boolean;
    discount_type: string;
    discount_value: number;
    min_purchase: number;
  };
}

/* ===== API Functions ===== */

/**
 * Save a coupon for the authenticated user
 * @param couponId - The ID of the coupon to save
 * @returns Promise with success status and message
 */
export async function saveCoupon(
  couponId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    const response = await axios.post(
      `${API_URL}/api/user/coupons`,
      { couponId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: response.data.message || "Coupon saved",
    };
  } catch (error: any) {
    console.log("🔥 SAVE COUPON ERROR FULL:", error);

    if (error.response) {
      console.log("🔥 STATUS:", error.response.status);
      console.log("🔥 DATA:", error.response.data);
    }

    return {
      success: false,
      message: error.response?.data?.message || "Server error",
    };
  }
}

/**
 * Fetch all coupons for the authenticated user
 * @returns Promise with array of user coupons
 */
export async function fetchUserCoupons(): Promise<UserCoupon[]> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return [];
    }
    const response = await axios.get(`${API_URL}/api/user/coupons`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data || [];
  } catch (error: any) {
    // If it's a 401 error, let the AuthContext interceptor handle it
    if (error.response?.status === 401) {
      throw error;
    }
    
    console.error('Error fetching user coupons:', error);
    return [];
  }
}

/* ===== Helper Functions ===== */

/**
 * Get authentication token from storage
 * @returns Token string or null
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  } catch (error) {
    return null;
  }
}
