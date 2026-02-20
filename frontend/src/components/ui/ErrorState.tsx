import { Button } from './Button';

interface ErrorStateProps {
    error?: Error | string;
    title?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    error,
    title = 'Something went wrong',
    onRetry,
    className = ''
}: ErrorStateProps) {
    const errorMessage = error instanceof Error ? error.message : error;

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center min-h-[50vh] animate-fade-in ${className}`}>
            <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-red-400">error</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            {errorMessage && (
                <p className="text-white/60 text-sm max-w-xs mb-6">{errorMessage}</p>
            )}
            {onRetry && (
                <Button onClick={onRetry} variant="secondary">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Try Again
                </Button>
            )}
        </div>
    );
}
