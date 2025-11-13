import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type ReactNode } from 'react';
import { BreadcrumbItem } from '@/types'; // Import BreadcrumbItem

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[]; // Add breadcrumbs prop
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppSidebarLayout>
);