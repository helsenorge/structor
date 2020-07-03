export interface IPatient {
    id: string;
    name: IName[];
    birthDate: string;
    gender: string;
    map(data: any): any;
    address: IAddress[];
    telecom: ITelecom[];
    url: string;
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
    use: string;
    system: string;
    value: number;
}

export interface dataSourceType {
    id: string;
    schemaName: string | undefined;
    submitted: string;
}
