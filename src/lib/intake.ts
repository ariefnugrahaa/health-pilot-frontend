import { IntakeConfig } from "@/types/intake";
import { MOCK_INTAKE_CONFIG } from "./mock-intake";

export async function getIntakeConfig(): Promise<IntakeConfig> {
    try {
        // In a real SSR scenario, as this is called on the server,
        // we might want to talk to the backend directly via internal URL or similar.
        // For now, we'll try the local API and fallback to mock.
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_BASE_URL}/api/v1/intakes/config`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            console.warn('Failed to fetch intake config from API, using mock data');
            return MOCK_INTAKE_CONFIG;
        }

        const result = await res.json();
        return result.success ? result.data : MOCK_INTAKE_CONFIG;
    } catch (err) {
        console.error('Error fetching intake config:', err);
        return MOCK_INTAKE_CONFIG;
    }
}
