interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullScreen?: boolean;
    text?: string;
}

export function LoadingSpinner({
    size = 'md',
    className = '',
    fullScreen = false,
    text
}: LoadingSpinnerProps) {
    const sizes = {
        sm: 'size-5',
        md: 'size-8',
        lg: 'size-12'
    };

    const spinner = (
        <div className={`flex flex-col items-center justify-center min-h-[30vh] gap-3 animate-fade-in ${className}`}>
            <div className={`${sizes[size]} relative`}>
                <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
            </div>
            {text && <p className="text-white/60 text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-background-dark flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}

export function PageLoader({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}
