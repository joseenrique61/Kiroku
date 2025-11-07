import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            asChild = false,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? 'div' : 'button';
        const buttonClasses = [
            'button',
            `button--${variant}`,
            `button--${size}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return <Comp className={buttonClasses} ref={ref} {...props} />;
    },
);

Button.displayName = 'Button';

export { Button };
