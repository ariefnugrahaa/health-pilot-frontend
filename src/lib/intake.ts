import { IntakeConfig } from "@/types/intake";

export async function getIntakeConfig(assignedTo?: string): Promise<IntakeConfig | null> {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const url = new URL(`${API_BASE_URL}/api/v1/intakes/config`);
        if (assignedTo) {
            url.searchParams.set('assignedTo', assignedTo);
        }

        const res = await fetch(url.toString(), {
            cache: 'no-store',
        });

        if (!res.ok) {
            console.warn('Failed to fetch ACTIVE intake config from API');
            return null;
        }

        const result = await res.json();
        if (!result.success || !result.data?.steps?.length) {
            return null;
        }

        return result.data;
    } catch (err) {
        console.error('Error fetching intake config:', err);
        return null;
    }
}
