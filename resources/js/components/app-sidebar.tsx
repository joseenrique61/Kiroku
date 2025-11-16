import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import AppLogoIcon from './app-logo-icon';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    navItems: NavItem[];
    footerItems: NavItem[];
}

const AppSidebar = ({ navItems, footerItems, ...props }: AppSidebarProps) => {
    const page = usePage();
    return (
        <aside className="app-sidebar" {...props}>
            <AppSidebarHeader />
            <AppSidebarNav>
                {navItems.map((navItem) => (
                    <AppSidebarItem
                        navItem={navItem}
                        isActive={page.url.startsWith(
                            new URL(navItem.href).pathname,
                        )}
                        key={navItem.title}
                    />
                ))}
            </AppSidebarNav>
            <AppSidebarFooter>
                {footerItems.map((footerItem) => (
                    <AppSidebarItem
                        navItem={footerItem}
                        isActive={page.url.startsWith(
                            new URL(footerItem.href).pathname,
                        )}
                        key={footerItem.title}
                    />
                ))}
            </AppSidebarFooter>
        </aside>
    );
};

const AppSidebarHeader = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className="app-sidebar__header" {...props}>
            <AppLogoIcon className="app-sidebar__header-icon" />
            <h3 className="app-sidebar__header-title">Kiroku</h3>
        </div>
    );
};

interface AppSidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

const AppSidebarNav = ({ children, ...props }: AppSidebarNavProps) => {
    return (
        <nav className="app-sidebar__nav" {...props}>
            <ul className="app-sidebar__nav-list">{children}</ul>
        </nav>
    );
};

interface AppSidebarItemProps extends React.HTMLAttributes<HTMLLIElement> {
    navItem: NavItem;
    isActive: boolean;
}

const AppSidebarItem = ({
    navItem,
    isActive,
    ...props
}: AppSidebarItemProps) => {
    return (
        <li className="app-sidebar__nav-item" {...props}>
            <Link
                href={navItem.href}
                className={`app-sidebar__nav-link ${isActive ? 'app-sidebar__nav-link--active' : ''}`}
                method={navItem.method}
                prefetch
            >
                {navItem.icon && (
                    <navItem.icon className="app-sidebar__nav-icon" />
                )}
                <span>{navItem.title}</span>
            </Link>
        </li>
    );
};

const AppSidebarFooter = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <footer className="app-sidebar__footer" {...props}>
            <ul className="app-sidebar__footer-list">{children}</ul>
        </footer>
    );
};

export default AppSidebar;
