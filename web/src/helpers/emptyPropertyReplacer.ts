/*
Replacer function for use with JSON.stringify that removes properties with no value and empty arrays or objects
Note that this will not remove objects where all properties are without value:
{
    object: {property: undefined}
}
will give:
{
    object: {}
}
 */
const isEmptyObject = (value: unknown): boolean => {
    return typeof value === 'object' && Object.keys(<Record<string, unknown>>value).length === 0;
};

export const emptyPropertyReplacer = (_key: string, value: unknown): unknown => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (Array.isArray(value)) {
        // remove empty objects from array (to avoid null values in arrays)
        const filteredValue = value.filter((x) => !isEmptyObject(x));
        return filteredValue.length === 0 ? undefined : filteredValue;
    }
    if (isEmptyObject(value)) {
        return undefined;
    }
    return value;
};
