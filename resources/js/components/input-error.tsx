import React from 'react';

interface InputErrorProps {
    message?: string;
    className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, className }) => {
    if (!message) {
        return null;
    }

    const errorClasses = ['input-error', className].filter(Boolean).join(' ');

    return <p className={errorClasses}>{message}</p>;
};

export default InputError;
