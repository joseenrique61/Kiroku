export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    role: Role;
    role_id: number;

    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
}