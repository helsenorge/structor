import createUUID from './CreateUUID';

export const createSystemUUID = (): string => {
    return `urn:uuid:${createUUID()}`;
};

export const isSystemValid = (system: string): boolean => {
    return system.substr(0, 4) === 'urn:' || system.substr(0, 7) === 'http://' || system.substr(0, 8) === 'https://';
};

export enum CodingSystemType {
    valueSetTqqc = 'http://ehelse.no/fhir/ValueSet/TQQC',
}
