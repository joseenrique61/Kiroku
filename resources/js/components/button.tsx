import React from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
type ButtonSizes = 'sm' | 'md' | 'lg';

interface CommonButtonProps {
    variant?: ButtonVariants;
    size?: ButtonSizes;
    className?: string;
}

// Define the props for when asChild is false (renders a button)
interface ButtonAsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CommonButtonProps {
    asChild?: false;
}

// Define the props for when asChild is true (renders a div, or whatever child is passed)
interface ButtonAsChildProps extends React.HTMLAttributes<HTMLDivElement>, CommonButtonProps {
    asChild: true;
}

// Union type for ButtonProps
type ButtonProps = ButtonAsButtonProps | ButtonAsChildProps;

const Button = React.forwardRef<HTMLButtonElement | HTMLDivElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            asChild = false,
            ...props
        },
        forwardedRef,
    ) => {
        const buttonClasses = [
            'button',
            `button--${variant}`,
            `button--${size}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        if (asChild) {
            return (
                <div
                    className={buttonClasses}
                    ref={forwardedRef as React.Ref<HTMLDivElement>}
                    {...(props as React.HTMLAttributes<HTMLDivElement>)}
                />
            );
        } else {
            return (
                <button
                    className={buttonClasses}
                    ref={forwardedRef as React.Ref<HTMLButtonElement>}
                    {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                />
            );
        }
    },
);

Button.displayName = 'Button';

export { Button };
