export interface IPatient {
    id: string;
    name: IName[];
    birthDate: string;
    gender: string;
}

export interface IName {
    family: string;
    given: string[];
}
