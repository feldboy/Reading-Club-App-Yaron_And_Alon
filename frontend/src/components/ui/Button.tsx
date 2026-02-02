import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variants = {
        primary: 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20',
        secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
        ghost: 'bg-transparent text-white hover:bg-white/10',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="material-symbols-outlined animate-spin text-current">progress_activity</span>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    );
}

export function IconButton({
    children,
    variant = 'ghost',
    size = 'md',
    className = '',
    'aria-label': ariaLabel,
    ...props
}: Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth'> & { 'aria-label': string }) {
    const baseStyles = 'inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-90';

    const variants = {
        primary: 'bg-primary text-white hover:brightness-110',
        secondary: 'bg-white/10 text-white hover:bg-white/20',
        ghost: 'bg-transparent text-white hover:bg-white/10',
        danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
    };

    const sizes = {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </button>
    );
}
