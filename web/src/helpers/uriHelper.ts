import createUUID from "./CreateUUID";

export const createUriUUID = (): string => {
  return `urn:uuid:${createUUID()}`;
};

export const isUriValid = (uri: string): boolean => {
  return (
    uri.substring(0, 4) === "urn:" ||
    uri.substring(0, 7) === "http://" ||
    uri.substring(0, 8) === "https://"
  );
};

export enum CodingSystemType {
  valueSetTqqc = "http://ehelse.no/fhir/ValueSet/TQQC",
}
