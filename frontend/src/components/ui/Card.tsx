import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'outlined';
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
    style?: CSSProperties;
}

export function Card({
    children,
    variant = 'default',
    className = '',
    onClick,
    hoverable = false,
    style
}: CardProps) {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variants = {
        default: 'bg-white/5 border border-white/10',
        glass: 'glass-card',
        outlined: 'border border-white/20 bg-transparent'
    };

    const hoverStyles = hoverable
        ? 'hover:border-primary/50 hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
        : '';

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
            style={style}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`p-4 pb-2 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`p-4 pt-2 border-t border-white/5 ${className}`}>{children}</div>;
}
