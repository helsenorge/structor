export default interface ISection {
    id: string;
    questionOrder: Array<string>;
    sectionTitle: string;
    description?: string;
    valid?: boolean;
}
