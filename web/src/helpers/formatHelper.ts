export const removeSpace = (value: string): string => {
  return value.replace(/\s/g, "-").toLocaleLowerCase();
};

export const isNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value));
};
