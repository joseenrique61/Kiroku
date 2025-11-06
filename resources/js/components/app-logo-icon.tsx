import React from 'react';

const AppLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5-10-5-10 5z" />
            <path d="M12 12L2 7" />
            <path d="M12 12L22 7" />
            <path d="M12 12V22" />
        </svg>
    );
};

export default AppLogoIcon;
