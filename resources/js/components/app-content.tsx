import React from 'react';

const AppContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
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
