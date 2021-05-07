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
export const emptyPropertyReplacer = (key: string, value: unknown): unknown => {
    if (!value) {
        return undefined;
    }
    if (Array.isArray(value) && value.length === 0) {
        return undefined;
    }
    if (typeof value === 'object' && Object.keys(<Record<string, unknown>>value).length === 0) {
        return undefined;
    }
    return value;
};
