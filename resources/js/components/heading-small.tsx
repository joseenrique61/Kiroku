import React from 'react';

interface HeadingSmallProps {
    title: string;
    description: string;
}

const HeadingSmall: React.FC<HeadingSmallProps> = ({ title, description }) => {
    return (
        <div className="heading-small">
            <h3 className="heading-small__title">{title}</h3>
            <p className="heading-small__description">{description}</p>
        </div>
    );
};

export default HeadingSmall;
