// import Heading from '@/components/heading';
import { Button } from '@/components/button';
import { Separator } from '@/components/separator';

import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: route('profile.edit'),
        icon: null,
    },
    {
        title: 'Password',
        href: route('password.edit'),
        icon: null,
    },
    {
        title: 'Appearance',
        href: route('appearance.edit'),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="settings-layout">
            {/* <Heading
                title="Settings"
                description="Manage your profile and account settings"
            /> */}

            <div className="settings-layout__content">
                <aside className="settings-layout__aside">
                    <nav className="settings-layout__nav">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = currentPath === item.href;
                            const buttonClasses = [
                                'settings-layout-button',
                                isActive ? 'settings-layout-button--active' : ''
                            ].filter(Boolean).join(' ');

                            return (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={buttonClasses}
                                >
                                    <Link href={item.href}>
                                        {item.icon && (
                                            <item.icon className="h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="settings-layout__separator" />

                <div className="settings-layout__main">
                    <section className="settings-layout__section">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
