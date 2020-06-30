// ResourceContainer in fhir.ts uses ICompose
export interface ICompose {
    include: IInclude[];
}

export interface IInclude {
    system: string;
    concept: IConcept[];
}

export interface IConcept {
    code: string;
    display: string;
}
