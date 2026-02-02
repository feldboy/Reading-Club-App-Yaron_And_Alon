import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    variant?: 'default' | 'glass';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    leftIcon,
    rightIcon,
    variant = 'default',
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const variants = {
        default: 'bg-white/5 border border-white/10 focus-within:border-primary/60',
        glass: 'glass-panel focus-within:border-primary/60'
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-primary text-xs font-bold tracking-widest uppercase opacity-80 pl-1"
                >
                    {label}
                </label>
            )}
            <div className={`flex items-stretch rounded-xl transition-all duration-300 ${variants[variant]} ${error ? 'border-red-500/60' : ''}`}>
                {leftIcon && (
                    <div className="text-white/40 flex items-center justify-center pl-4">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-14 placeholder:text-white/30 p-4 text-base font-normal leading-normal text-white ${leftIcon ? 'pl-2' : ''} ${rightIcon ? 'pr-2' : ''} ${className}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {rightIcon && (
                    <div className="text-white/40 flex items-center justify-center pr-4">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p id={`${inputId}-error`} className="text-red-400 text-sm pl-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    variant?: 'default' | 'glass';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    label,
    error,
    variant = 'default',
    className = '',
    id,
    ...props
}, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const variants = {
        default: 'bg-white/5 border border-white/10 focus-within:border-primary/60',
        glass: 'glass-panel focus-within:border-primary/60'
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="text-primary text-xs font-bold tracking-widest uppercase opacity-80 pl-1"
                >
                    {label}
                </label>
            )}
            <div className={`rounded-xl transition-all duration-300 ${variants[variant]} ${error ? 'border-red-500/60' : ''}`}>
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 min-h-32 placeholder:text-white/30 p-4 text-base font-normal leading-relaxed text-white resize-none outline-none ${className}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : undefined}
                    {...props}
                />
            </div>
            {error && (
                <p id={`${textareaId}-error`} className="text-red-400 text-sm pl-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

TextArea.displayName = 'TextArea';
