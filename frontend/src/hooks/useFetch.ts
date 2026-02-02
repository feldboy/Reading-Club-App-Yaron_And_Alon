import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
}

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for data fetching with loading and error states
 * Follows React UI patterns: only show loading when no data exists
 */
export function useFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: UseFetchOptions<T>
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetcher();
            setData(result);
            options?.onSuccess?.(result);
        } catch (err) {
            const error = err as Error;
            setError(error);
            options?.onError?.(error);
        } finally {
            setLoading(false);
        }
    }, [fetcher, options]);

    useEffect(() => {
        if (options?.enabled !== false) {
            refetch();
        }
    }, [key, options?.enabled]);

    return { data, loading, error, refetch };
}

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 */
interface UseMutationOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

interface UseMutationResult<T, V> {
    mutate: (variables: V) => Promise<T | null>;
    data: T | null;
    loading: boolean;
    error: Error | null;
    reset: () => void;
}

export function useMutation<T, V = void>(
    mutationFn: (variables: V) => Promise<T>,
    options?: UseMutationOptions<T>
): UseMutationResult<T, V> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (variables: V): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await mutationFn(variables);
            setData(result);
            options?.onSuccess?.(result);
            return result;
        } catch (err) {
            const error = err as Error;
            setError(error);
            options?.onError?.(error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [mutationFn, options]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { mutate, data, loading, error, reset };
}
