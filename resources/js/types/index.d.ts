import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    icon?: LucideIcon | null;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    submenu?: Array<{
        title: string;
        href: string;
        isActive?: boolean;
    }>;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    job_title?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    url?: string;
    read_at: string | null;
    created_at: string;
    time_ago: string;
    data?: Record<string, unknown>;
}

export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}
