import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import AppSidebar from '@/components/app-sidebar';
import { NavItem, type BreadcrumbItem } from '@/types';
import { LayoutDashboard, Settings } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const navItems: NavItem[] = [
        {
            title: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard
        }
    ];

    const footerItems: NavItem[] = [
        {
            title: "Settings",
            href: route("profile.edit"),
            icon: Settings
        }
    ];

    return (
        <AppShell>
            <AppSidebar navItems={navItems} footerItems={footerItems}/>

            {/* TODO: Create sass file for AppSidebarLayout */}
            <AppContent className="overflow-x-hidden">
                {/* <AppSidebarHeader breadcrumbs={breadcrumbs} /> */}
                {children}
            </AppContent>
        </AppShell>
    );
}