interface AvatarProps {
    src?: string;
    alt: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
    className?: string;
    bordered?: boolean;
    status?: 'online' | 'offline' | 'away';
}

export function Avatar({
    src,
    alt,
    size = 'md',
    fallback,
    className = '',
    bordered = false,
    status
}: AvatarProps) {
    const sizes = {
        xs: 'size-6 text-[8px]',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-lg'
    };

    const statusSizes = {
        xs: 'size-2',
        sm: 'size-2.5',
        md: 'size-3',
        lg: 'size-3.5',
        xl: 'size-4'
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-500',
        away: 'bg-yellow-500'
    };

    const borderStyles = bordered ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark' : '';

    // Generate initials from alt text
    const initials = fallback || alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className={`relative inline-block ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className={`${sizes[size]} rounded-full object-cover ${borderStyles}`}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white ${borderStyles}`}
                    aria-label={alt}
                >
                    {initials}
                </div>
            )}
            {status && (
                <span
                    className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-background-dark`}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
}

interface AvatarGroupProps {
    avatars: Array<{ src?: string; alt: string }>;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
    const displayAvatars = avatars.slice(0, max);
    const remaining = avatars.length - max;

    const sizes = {
        xs: 'size-6 text-[8px]',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base'
    };

    const overlaps = {
        xs: '-space-x-2',
        sm: '-space-x-3',
        md: '-space-x-4',
        lg: '-space-x-5'
    };

    return (
        <div className={`flex items-center ${overlaps[size]}`}>
            {displayAvatars.map((avatar, index) => (
                <div key={index} className="ring-2 ring-background-dark rounded-full">
                    <Avatar {...avatar} size={size} />
                </div>
            ))}
            {remaining > 0 && (
                <div
                    className={`${sizes[size]} rounded-full bg-white/10 flex items-center justify-center font-bold text-white ring-2 ring-background-dark`}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
}
