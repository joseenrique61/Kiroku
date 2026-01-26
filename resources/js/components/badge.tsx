import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'default',
    ...props
}) => {
    const badgeClasses = ['badge', `badge--${variant}`, className]
        .filter(Boolean)
        .join(' ');

    return <div className={badgeClasses} {...props} />;
};

export { Badge };
