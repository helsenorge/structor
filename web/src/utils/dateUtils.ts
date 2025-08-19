import { isDate, isValid } from "date-fns";

export function isRealDate(d: unknown): d is Date {
  if (!isDate(d)) return false;
  return isValid(d);
}
export const toIsoOrUndefined = (d: unknown): string | undefined =>
  isRealDate(d) ? d.toISOString() : undefined;
