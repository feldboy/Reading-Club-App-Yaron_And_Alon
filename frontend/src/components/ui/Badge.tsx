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
    const baseStyles = 'flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all cursor-pointer active:scale-95';

    const selectedStyles = selected
        ? 'bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20 text-white font-bold'
        : 'bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10';

    return (
        <button
            className={`${baseStyles} ${selectedStyles} ${className}`}
            onClick={onClick}
            role="option"
            aria-selected={selected}
        >
            <span className="text-sm leading-normal">{children}</span>
        </button>
    );
}
