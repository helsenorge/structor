import { useEffect } from 'react';

const unhandledKeyPressTargets = ['INPUT', 'TEXTAREA', 'SELECT'];
const unhandledKeyPressClassNames = ['ck-content'];

export const useKeyPress = (targetKey: string, callback: () => void, disabled?: boolean): void => {
    const keyPressHandler = ({ key, target }: KeyboardEvent) => {
        const { tagName, classList } = target as Element;
        const ignoreClassName = unhandledKeyPressClassNames.some(
            (unhandledClassName) => classList && classList.contains(unhandledClassName),
        );
        const ignoreTargetType = unhandledKeyPressTargets.includes(tagName);

        if (!(ignoreClassName || ignoreTargetType) && key === targetKey) {
            callback();
        }
    };

    useEffect(() => {
        if (!disabled) {
            window.addEventListener('keydown', keyPressHandler);
        }

        return () => {
            window.removeEventListener('keydown', keyPressHandler);
        };
    });
};
