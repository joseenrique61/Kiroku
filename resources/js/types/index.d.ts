import { LucideIcon } from 'lucide-react';
import { User } from './user';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete'; // HTTP method for the link
}