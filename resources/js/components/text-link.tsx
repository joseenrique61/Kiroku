import { Link } from '@inertiajs/react';
import React from 'react';

interface TextLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    tabIndex?: number;
}

const TextLink: React.FC<TextLinkProps> = ({
    href,
    children,
    className,
    tabIndex,
}) => {
    const linkClasses = ['text-link', className].filter(Boolean).join(' ');

    return (
        <Link href={href} className={linkClasses} tabIndex={tabIndex}>
            {children}
        </Link>
    );
};

export default TextLink;
