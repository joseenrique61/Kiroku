import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="auth-layout">
            <div className="auth-layout__container">
                <div className="auth-layout__content">
                    <div className="auth-layout__header">
                        <Link href={home()} className="auth-layout__logo-link">
                            <div className="auth-layout__logo-container">
                                <AppLogoIcon className="auth-layout__logo-icon" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="auth-layout__title-container">
                            <h1 className="auth-layout__title">{title}</h1>
                            <p className="auth-layout__description">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
