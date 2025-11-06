import React, { useEffect, useRef, useState } from 'react';

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
}

const Select = ({ children, value, onValueChange, ...props }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (selectedValue: string) => {
        onValueChange?.(selectedValue);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            selectRef.current &&
            !selectRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="select" ref={selectRef} {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === SelectTrigger) {
                        return React.cloneElement(
                            child as React.ReactElement<SelectTriggerProps>,
                            {
                                onClick: handleToggle,
                                'aria-expanded': isOpen,
                                currentValue: value,
                            },
                        );
                    } else if (child.type === SelectContent) {
                        return React.cloneElement(
                            child as React.ReactElement<SelectContentProps>,
                            {
                                isOpen,
                                onSelect: handleSelect,
                                selectedValue: value,
                            },
                        );
                    }
                }
                return child;
            })}
        </div>
    );
};

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
    'aria-expanded'?: boolean;
    currentValue?: string;
}

const SelectTrigger = ({
    className,
    children,
    currentValue,
    ...props
}: SelectTriggerProps) => {
    return (
        <div
            className={['select__trigger', className].filter(Boolean).join(' ')}
            {...props}
        >
            <span className="select__value">
                {currentValue ? (
                    React.Children.map(children, (child) => {
                        if (
                            React.isValidElement(child) &&
                            child.type === SelectValue
                        ) {
                            return React.cloneElement(
                                child as React.ReactElement<SelectValueProps>,
                                { children: currentValue },
                            );
                        }
                        return child;
                    })
                ) : (
                    <span className="select__trigger--placeholder">
                        Select an option
                    </span>
                )}
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="select__icon"
            >
                <path d="M6 9l6 6 6-6" />
            </svg>
        </div>
    );
};

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {}

const SelectValue = ({ className, ...props }: SelectValueProps) => {
    return (
        <span
            className={['select__value', className].filter(Boolean).join(' ')}
            {...props}
        />
    );
};

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean;
    onSelect?: (value: string) => void;
    selectedValue?: string;
}

const SelectContent = ({
    className,
    children,
    isOpen,
    onSelect,
    selectedValue,
    ...props
}: SelectContentProps) => {
    if (!isOpen) return null;

    return (
        <div
            className={['select__content', className].filter(Boolean).join(' ')}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SelectItem) {
                    return React.cloneElement(
                        child as React.ReactElement<SelectItemProps>,
                        {
                            onSelect,
                            isSelected: child.props.value === selectedValue,
                        },
                    );
                }
                return child;
            })}
        </div>
    );
};

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onSelect?: (value: string) => void;
    isSelected?: boolean;
}

const SelectItem = ({
    className,
    children,
    value,
    onSelect,
    isSelected,
    ...props
}: SelectItemProps) => {
    const handleItemClick = () => {
        onSelect?.(value);
    };

    return (
        <div
            className={[
                'select__item',
                isSelected ? 'select__item--selected' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            onClick={handleItemClick}
            role="option"
            aria-selected={isSelected}
            {...props}
        >
            {children}
        </div>
    );
};

interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectGroup = ({ className, ...props }: SelectGroupProps) => {
    return (
        <div
            className={['select__group', className].filter(Boolean).join(' ')}
            {...props}
        />
    );
};

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
    return (
        <div
            className={['select__label', className].filter(Boolean).join(' ')}
            {...props}
        />
    );
};

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectSeparator = ({ className, ...props }: SelectSeparatorProps) => {
    return (
        <div
            className={['select__separator', className]
                .filter(Boolean)
                .join(' ')}
            {...props}
        />
    );
};

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
