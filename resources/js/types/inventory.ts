import { Diagnostic } from './diagnostic';

export interface Inventory {
    id: number;
    imei: string;
    status: string;
    model: string | null;
    year: string | null;
    image: string | null;
    diagnoses: Diagnostic[];
    created_at: string;
    updated_at: string;
} 