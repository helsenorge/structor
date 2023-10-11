export const removeSpace = (value: string): string => {
    return value.replace(/\s/g, '-').toLocaleLowerCase();
};
