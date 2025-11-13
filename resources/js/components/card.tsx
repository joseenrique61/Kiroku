import React from 'react';

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={['card', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={['card__header', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <h3
            className={['card__title', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </h3>
    );
};

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <p
            className={['card__description', className]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {props.children}
        </p>
    );
};

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={['card__content', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={['card__footer', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

export {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
};
