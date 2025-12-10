import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import AppSidebar from '@/components/app-sidebar';
import { NavItem } from '@/types';
import { Computer, FileCog, LayoutDashboard, Settings, TriangleAlert, Wrench, User, Building2, Warehouse, Home, LogOut} from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types/globals';

interface AppSidebarLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppSidebarLayout({
    children,
    breadcrumbs,
}: AppSidebarLayoutProps) {

    const { auth } = usePage<SharedData>().props;
    const userPermissions: string[] = auth.user?.permissions || [];

    const navItems: NavItem[] = [
        {
            title: "Home",
            href: route("home"),
            icon: Home,
        },
        {
            title: "Business Intelligence",
            href: route("dashboard"),
            icon: LayoutDashboard,
            permission: "view-dashboard",
        },
        {
            title: "My Organization",
            href: route("organizations.show", { organization: auth.user.organization_id }),
            icon: Warehouse,
            permission: "view-organization-policies",
        },
        {
            title: "Devices",
            href: route("devices.index"),
            icon: Computer,
            permission: "view-devices",
        },
        {
            title: "Maintenances",
            href: route("maintenances.index"),
            icon: Wrench,
            permission: "view-maintenances",
        },
        {
            title: "Failure Types",
            href: route("failureTypes.index"),
            icon: TriangleAlert,
            permission: "view-failure-types",
        },
        {
            title: "Logs",
            href: route("logs.index"),
            icon: FileCog,
            permission: "view-audit-logs",
        },
        {
            title: "Users",
            href: route("users.index"),
            icon: User,
            permission: "view-users",
        },
        {
            title: "Organizations",
            href: route("organizations.index"),
            icon: Building2,
            permission: "view-organizations",
        },
        
    ];

    const footerItems: NavItem[] = [
        {
            title: "Settings",
            href: route("profile.edit"),
            icon: Settings,
        },
        {
            title: "Logout",
            href: route("logout"),
            icon: LogOut,
            method: 'post',
        }
    ];

    const filteredNavItems = navItems.filter(item => 
        !item.permission || userPermissions.includes(item.permission)
    );

    return (
        <AppShell>
            <AppSidebar navItems={filteredNavItems} footerItems={footerItems}/>

            <AppContent className="app-content" breadcrumbs={breadcrumbs}>
                {children}
            </AppContent>
        </AppShell>
    );
}