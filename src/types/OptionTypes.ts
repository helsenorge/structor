export type Option = {
    code: string;
    display: string;
};

export type OptionGroup = {
    display: string;
    options: Array<Option>;
};

export type Options = {
    options: Array<Option | OptionGroup>;
};

export const isOptionGroup = (optionElement: Option | OptionGroup): boolean => {
    return !!(<OptionGroup>optionElement).options;
};
