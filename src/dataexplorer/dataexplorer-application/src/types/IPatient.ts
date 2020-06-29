export interface IPatient {
    id: string;
    name: IName[];
    birthDate: string;
    gender: string;
    map(data: any): any;
    address: IAddress[];
    telecom: ITelecom[];
    setName: () => void;
    photo: IPhoto[];
    url: string;
}

export interface IName {
    family: string;
    given: string[];
}

export interface IPatientIdentifier {
    entry: IPatientResource[];
    total: number;
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
