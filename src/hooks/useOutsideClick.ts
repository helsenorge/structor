import { MutableRefObject, useEffect } from 'react';

const useOutsideClick = (
    ref: MutableRefObject<HTMLDivElement | null>,
    onClickOutside: () => void,
    disabled?: boolean,
): void => {
    const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            onClickOutside();
        }
    };

    useEffect(() => {
        if (!disabled) {
            document.addEventListener('mousedown', handleClick);
        }
        return (): void => {
            document.removeEventListener('mousedown', handleClick);
        };
    });
};

export default useOutsideClick;
