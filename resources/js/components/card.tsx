import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, ...props }: CardProps) => {
    return (
        <div
            className={['card', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
    return (
        <div
            className={['card__header', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = ({ className, ...props }: CardTitleProps) => {
    return (
        <h3
            className={['card__title', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </h3>
    );
};

interface CardDescriptionProps
    extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
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

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = ({ className, ...props }: CardContentProps) => {
    return (
        <div
            className={['card__content', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </div>
    );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = ({ className, ...props }: CardFooterProps) => {
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
