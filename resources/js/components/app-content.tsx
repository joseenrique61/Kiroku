import React from 'react';
import { BreadcrumbItem } from '@/types'; // Import BreadcrumbItem

interface AppContentProps extends React.HTMLAttributes<HTMLDivElement> {
    breadcrumbs?: BreadcrumbItem[];
}

const AppContent = ({ className, breadcrumbs, ...props }: AppContentProps) => {
    return (
        <div
            className={['app-content', className].filter(Boolean).join(' ')}
            {...props}
        >
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="app-content__breadcrumbs">
                    {breadcrumbs.map((item, index) => (
                        <React.Fragment key={item.href}>
                            {index > 0 && <span className="app-content__breadcrumb-separator">/</span>}
                            <a href={item.href} className="app-content__breadcrumb-item">
                                {item.title}
                            </a>
                        </React.Fragment>
                    ))}
                </nav>
            )}
            {props.children}
        </div>
    );
};

export { AppContent };