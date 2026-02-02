import { useState, useCallback } from 'react';

/**
 * Toggle between true and false states
 * Returns a tuple with the current value and a toggle function
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(v => !v);
    }, []);

    return [value, toggle, setValue];
}
