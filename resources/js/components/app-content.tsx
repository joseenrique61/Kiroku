import React from 'react';

interface AppContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AppContent = ({ className, ...props }: AppContentProps) => {
    return (
        <div
            className={['app-content', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

export { AppContent };
