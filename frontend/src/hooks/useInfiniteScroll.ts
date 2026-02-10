import { useEffect, useRef, useCallback } from 'react';

/**
 * Options for useInfiniteScroll hook
 */
interface UseInfiniteScrollOptions {
    hasNextPage: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    threshold?: number; // Distance from bottom in pixels before triggering
}

/**
 * Infinite scroll hook
 * Detects when user scrolls near the bottom and triggers callback
 */
export const useInfiniteScroll = ({
    hasNextPage,
    isLoading,
    onLoadMore,
    threshold = 200,
}: UseInfiniteScrollOptions): void => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isLoading) {
                onLoadMore();
            }
        },
        [hasNextPage, isLoading, onLoadMore]
    );

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: `${threshold}px`,
            threshold: 0.1,
        };

        observerRef.current = new IntersectionObserver(handleObserver, options);

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observerRef.current.observe(currentSentinel);
        }

        return () => {
            if (observerRef.current && currentSentinel) {
                observerRef.current.unobserve(currentSentinel);
            }
        };
    }, [handleObserver, threshold]);

    // Note: This hook doesn't return anything - it uses IntersectionObserver internally
    // The simpler version (useInfiniteScrollSimple) is used instead
};

/**
 * Alternative simpler version using scroll event
 */
export const useInfiniteScrollSimple = ({
    hasNextPage,
    isLoading,
    onLoadMore,
    threshold = 200,
}: UseInfiniteScrollOptions): void => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if user is near bottom
            if (scrollTop + windowHeight >= documentHeight - threshold && hasNextPage && !isLoading) {
                onLoadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isLoading, onLoadMore, threshold]);
};
