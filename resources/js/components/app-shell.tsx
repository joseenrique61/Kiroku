import React from 'react';

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {}

const AppShell = ({ className, ...props }: AppShellProps) => {
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
