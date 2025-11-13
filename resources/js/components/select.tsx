import React, { useEffect, useRef, useState } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    options: SelectOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
}

const Select = ({
    name,
    options,
    value,
    onValueChange,
    placeholder = 'Select an option',
    className,
    ...props
}: SelectProps) => {
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

    const selectedOption = options.find((option) => option.value === value);

    return (
        <div
            className={['select', className].filter(Boolean).join(' ')}
            ref={selectRef}
            {...props}
        >
            <div
                className="select__trigger"
                onClick={handleToggle}
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
            >
                <span className="select__value">
                    {selectedOption ? (
                        selectedOption.label
                    ) : (
                        <span className="select__trigger--placeholder">
                            {placeholder}
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
            {isOpen && (
                <div className="select__content">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={[
                                'select__item',
                                option.value === value
                                    ? 'select__item--selected'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            onClick={() => handleSelect(option.value)}
                            role="option"
                            aria-selected={option.value === value}
                            tabIndex={0}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSelect(option.value)
                            }
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            <input type="hidden" name={name} value={value || ''} />
        </div>
    );
};

export { Select };
