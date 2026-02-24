interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse'
}: SkeletonProps) {
    const baseStyles = 'bg-white/10';

    const variants = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: '',
        rounded: 'rounded-xl'
    };

    const animations = {
        pulse: 'animate-pulse',
        wave: 'skeleton-wave',
        none: ''
    };

    const style: React.CSSProperties = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${animations[animation]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}

// Pre-built skeleton components for common use cases
export function BookCardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <Skeleton variant="rounded" className="aspect-[3/4.5] w-full" />
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" height={12} />
        </div>
    );
}

export function ReviewCardSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Skeleton variant="rounded" className="w-full aspect-[4/3] mb-3" />
            <Skeleton variant="text" className="w-full mb-2" />
            <Skeleton variant="text" className="w-3/4 mb-4" />
            <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={80} />
            </div>
        </div>
    );
}

export function ProfileHeaderSkeleton() {
    return (
        <div className="flex flex-col items-center">
            <Skeleton variant="circular" width={128} height={128} />
            <Skeleton variant="text" className="w-40 mt-4" height={24} />
            <Skeleton variant="text" className="w-24 mt-2" height={16} />
            <Skeleton variant="text" className="w-64 mt-3" height={12} />
        </div>
    );
}
