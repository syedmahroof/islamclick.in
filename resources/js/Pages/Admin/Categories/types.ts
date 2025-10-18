export type Category = {
    id: number;
    name: string;
    en_name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    order: number;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    children?: Category[];
};

export type CategoryFormData = {
    name: string;
    en_name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    order: number;
    parent_id: number | null;
};

export type CategoryOption = {
    id: number;
    name: string;
    parent_id: number | null;
};
