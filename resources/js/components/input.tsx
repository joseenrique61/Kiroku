import React from 'react';

const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    const inputClasses = ['input', className].filter(Boolean).join(' ');

    return <input className={inputClasses} ref={ref} {...props} />;
});

Input.displayName = 'Input';

export { Input };
