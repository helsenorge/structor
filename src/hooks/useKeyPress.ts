import { useEffect } from 'react';

export const useKeyPress = (targetKey: string, callback: () => void): void => {
    // TODO Don't perform callback when key pressed inside inputs
    // TODO Fix typescript
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const keyPressHandler = ({ key }) => {
        if (key === targetKey) {
            callback();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', keyPressHandler);

        return () => {
            window.removeEventListener('keydown', keyPressHandler);
        };
    });
};
