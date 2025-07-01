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

export const createOID = (): string => {
  return `urn:oid:${createUUID()}`;
};
export const isValidOID = (oid: string): boolean => {
  return new RegExp(/urn:oid:[0-2](\.(0|[1-9][0-9]*))+/).test(oid);
};
export const isValidID = (id: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  return new RegExp(/^[A-Za-z0-9\-\.]{1,64}$/).test(id);
};
