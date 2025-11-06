import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import AppLogoIcon from './app-logo-icon';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    navItems: NavItem[];
}

const AppSidebar = ({ navItems, ...props }: AppSidebarProps) => {
    const page = usePage();
    return (
        <aside className="app-sidebar" {...props}>
            <AppSidebarHeader />
            <AppSidebarNav>
                {navItems.map((navItem) => (
                    <AppSidebarNavItem
                        navItem={navItem}
                        isActive={page.url.startsWith(
                            typeof navItem.href === 'string'
                                ? navItem.href
                                : navItem.href.url,
                        )}
                        key={navItem.title}
                    />
                ))}
            </AppSidebarNav>
        </aside>
    );
};

interface AppSidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const AppSidebarHeader = ({ ...props }: AppSidebarHeaderProps) => {
    return (
        <div className="app-sidebar__header" {...props}>
            <AppLogoIcon />
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

interface AppSidebarNavItemProps extends React.HTMLAttributes<HTMLLIElement> {
    navItem: NavItem;
    isActive: boolean;
}

const AppSidebarNavItem = ({
    navItem,
    isActive,
    ...props
}: AppSidebarNavItemProps) => {
    return (
        <li
            className={`app-sidebar__nav-item ${isActive ? 'app-sidebar__nav-item--active' : ''}`}
            {...props}
        >
            <Link
                href={navItem.href}
                className="app-sidebar__nav-link"
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

export default AppSidebar;
