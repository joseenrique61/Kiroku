import React from 'react';

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
    const labelClasses = ['label', className].filter(Boolean).join(' ');

    return <label className={labelClasses} ref={ref} {...props} />;
});

Label.displayName = 'Label';

export { Label };
