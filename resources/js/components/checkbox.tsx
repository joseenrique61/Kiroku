import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<
    HTMLInputElement,
    CheckboxProps
>(({ className, onCheckedChange, checked, ...props }, ref) => {
    const checkboxClasses = ['checkbox', className].filter(Boolean).join(' ');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(event.target.checked);
    };

    return (
        <input
            type="checkbox"
            className={checkboxClasses}
            ref={ref}
            checked={checked}
            onChange={handleChange}
            {...props}
        />
    );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };