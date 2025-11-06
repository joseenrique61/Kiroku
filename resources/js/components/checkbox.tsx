import React from 'react';

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    const checkboxClasses = ['checkbox', className].filter(Boolean).join(' ');

    return (
        <input
            type="checkbox"
            className={checkboxClasses}
            ref={ref}
            {...props}
        />
    );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
