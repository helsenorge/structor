export interface IPatient {
    id: string;
    name: IName[];
    birthDate: string;
    gender: string;
    map(data: any): any;
    address: IAddress[];
    telecom: ITelecom[];
    url: string;
    identifier: IIdentifier[];
}

export interface IIdentifier {
    system: string;
    value: number;
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

export interface IDataSource {
    id?: string;
    schemaName: string;
    submitted?: string;
}
