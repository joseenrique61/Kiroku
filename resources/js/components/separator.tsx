import React from 'react';

const Separator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const separatorClasses = ['separator', className].filter(Boolean).join(' ');

    return <div className={separatorClasses} ref={ref} {...props} />;
});

Separator.displayName = 'Separator';

export { Separator };
