import Section from '../types/Section';

export default interface IForm {
    sectionList: { [sectionNumber: number]: Section };
    lastIndex: number;
}