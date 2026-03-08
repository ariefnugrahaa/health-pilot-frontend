import {
  LandingPageSettings,
  defaultLandingPageSettings,
} from "@/types/landing-settings";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getLandingSettings(): Promise<LandingPageSettings> {
  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

    const res = await fetch(`${API_BASE_URL}/api/v1/settings/landing`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Failed to fetch landing settings from API");
      return defaultLandingPageSettings;
    }

    const result: ApiResponse<LandingPageSettings> = await res.json();

    if (!result.success || !result.data) {
      return defaultLandingPageSettings;
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching landing settings:", error);
    return defaultLandingPageSettings;
  }
}
