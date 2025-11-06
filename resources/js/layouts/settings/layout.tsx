// import Heading from '@/components/heading';
import { Button } from '@/components/button';
import { Separator } from '@/components/separator';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
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
                            const isActive = currentPath === (typeof item.href === 'string' ? item.href : item.href.url);
                            const buttonClasses = [
                                'settings-layout-button',
                                isActive ? 'settings-layout-button--active' : ''
                            ].filter(Boolean).join(' ');

                            return (
                                <Button
                                    key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
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
