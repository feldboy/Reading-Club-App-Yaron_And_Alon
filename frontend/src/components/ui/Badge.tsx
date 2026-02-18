import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md';
    className?: string;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all';

    const variants = {
        default: 'bg-white/5 text-white/70 border border-white/10',
        primary: 'bg-primary/20 text-primary border border-primary/30',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs'
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}

interface ChipProps {
    children: ReactNode;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
}

export function Chip({
    children,
    selected = false,
    onClick,
    className = ''
}: ChipProps) {
    const baseStyles = 'relative flex h-10 sm:h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 sm:px-6 transition-all duration-300 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e]';

    const selectedStyles = selected
        ? 'bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] shadow-lg shadow-purple-500/30 text-white font-bold scale-105'
        : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200/80 font-medium hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105';

    return (
        <button
            className={`${baseStyles} ${selectedStyles} ${className}`}
            onClick={onClick}
            role="option"
            aria-selected={selected}
        >
            <span className="text-sm sm:text-base leading-normal whitespace-nowrap">{children}</span>
        </button>
    );
}
