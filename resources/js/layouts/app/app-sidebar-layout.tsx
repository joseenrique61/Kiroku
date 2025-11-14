import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import AppSidebar from '@/components/app-sidebar';
import { NavItem } from '@/types';
import { Computer, FileCog, LayoutDashboard, Settings, TriangleAlert, Wrench } from 'lucide-react';
import { BreadcrumbItem } from '@/types'; // Import BreadcrumbItem
import { type PropsWithChildren } from 'react';

interface AppSidebarLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppSidebarLayout({
    children,
    breadcrumbs,
}: AppSidebarLayoutProps) {
    const navItems: NavItem[] = [
        {
            title: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard
        },
        {
            title: "Devices",
            href: route("devices.index"),
            icon: Computer
        },
        {
            title: "Maintenances",
            href: route("maintenances.index"),
            icon: Wrench
        },
        {
            title: "Failure Types",
            href: route("failureTypes.index"),
            icon: TriangleAlert
        },
        {
            title: "Logs",
            href: route("logs.index"),
            icon: FileCog
        },
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
            <AppContent className="overflow-x-hidden" breadcrumbs={breadcrumbs}>
                {/* <AppSidebarHeader breadcrumbs={breadcrumbs} /> */}
                {children}
            </AppContent>
        </AppShell>
    );
}