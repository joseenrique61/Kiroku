import React from 'react';

interface PlaceholderPatternProps
    extends React.HTMLAttributes<HTMLDivElement> {}

const PlaceholderPattern = ({
    className,
    ...props
}: PlaceholderPatternProps) => {
    return (
        <div
            className={['placeholder-pattern', className]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

export { PlaceholderPattern };
