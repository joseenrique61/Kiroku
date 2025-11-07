import React from 'react';

const AppShell = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={['app-shell', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

export { AppShell };
