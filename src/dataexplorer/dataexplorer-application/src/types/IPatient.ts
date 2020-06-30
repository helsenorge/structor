export interface IPatient {
    id: string;
    name: IName[];
    birthDate: string;
    gender: string;
    map(data: any): any;
    address: IAddress[];
    telecom: ITelecom[];
    photo: IPhoto[];
    url: string;
}

export interface IState {
    setName: (name: string) => void;
    setSchema: (id: string) => void;
    patientID: number;
}
export interface IRecord {
    id: number;
    schemaName: string;
}
export interface IPatientIdentifier {
    entry: IPatientResource[];
    total: number;
}

export interface IName {
    family: string;
    given: string[];
}

export interface IPatientResource {
    resource: IPatient;
}
export interface IAddress {
    use: string;
    line: string[];
}

export interface ITelecom {
    value: number;
}

export interface IPhoto {
    url: string;
}
