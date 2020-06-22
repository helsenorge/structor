import Section from '../types/Section';
import InvalidArgumentException from './InvalidArgumentException';
import * as DND from 'react-beautiful-dnd';
import Question from './Question';

export type SectionList = { [sectionNumber: number]: Section };

export default class Form {
    static addSection(
        sectionList: SectionList,
        index?: number,
    ): SectionList {
        return sectionList[index] = new Section(index);
    }

    static removeSection(sectionList: SectionList, index: number): SectionList {
        if (!index) throw new InvalidArgumentException('No index was provided');
        delete sectionList[index];
        return sectionList;
    }

    static reorderSections(
        list: { [sectionNumber: number]: Section },
        oldIndex: number,
        newIndex: number,
    ): SectionList {
        if (!(oldIndex && newIndex))
            throw new InvalidArgumentException(
                'Was unable to swap position for question. oldIndex, newIndex or both was undefined \noldIndex: ' +
                    oldIndex +
                    '\nnewIndex: ' +
                    newIndex,
            );
        const tmpSection = list[oldIndex];
        list[oldIndex] = list[newIndex];
        list[newIndex] = tmpSection;
        return list;
    }

    static reorderQuestions(
        list: Array<Question>,
        oldIndex: number,
        newIndex: number,
    ): Array<Question> {
        if (!(oldIndex && newIndex))
            throw new InvalidArgumentException(
                'Was unable to swap position for question. oldIndex, newIndex or both was undefined \noldIndex: ' +
                    oldIndex +
                    '\nnewIndex: ' +
                    newIndex,
            );
        const tmpQuestion = list[oldIndex];
        list[oldIndex] = list[newIndex];
        list[newIndex] = tmpQuestion;

        return list;
    }

    // TODO: Fix return and draggebleStyle types
    static getChildComponentStyle(
        isDragging: boolean,
        draggableStyle: Array<unknown>,
    ): unknown {
        return {
            userSelect: 'none',
            padding: 8 * 2,
            margin: '0 10px 10px 0',

            display: 'inline-flex',
            width: '120px',

            // change background colour if dragging
            background: isDragging ? 'lightgreen' : 'grey',
            border: '1px solid grey',
            // styles we need to apply on draggables
            ...draggableStyle,
        };
    }

    // TODO: Fix return types
    static getParentComponentStyle(isDraggingOver: boolean): unknown {
        return {
            background: isDraggingOver ? 'lightblue' : 'lightgrey',
            padding: 8,
            margin: '10px 0',
        };
    }

    static onDragEnd(
        sectionList: SectionList,
        result: DND.DropResult,
    ): SectionList {
        if (!result.destination) {
            return sectionList;
        }
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (result.type === 'droppableItem') {
            sectionList = Form.reorderSections(
                sectionList,
                sourceIndex,
                destIndex,
            );
        } else if (result.type === 'droppableSubItem') {
            const sourceSectionId = parseInt(result.source.droppableId);
            const destSectionId = parseInt(result.destination.droppableId);

            const sourceQuestions = sectionList[sourceSectionId].questions;
            const destQuestions = sectionList[destSectionId].questions;

            if (sourceSectionId === destSectionId) {
                const reorderedQuestions = Form.reorderQuestions(
                    sourceQuestions,
                    sourceIndex,
                    destIndex,
                );
                sectionList[sourceSectionId].questions = reorderedQuestions;
            } else {
                const draggedItem = sourceQuestions.splice(sourceIndex, 1)[0];

                destQuestions.splice(destIndex, 0, draggedItem);

                sectionList[sourceSectionId].questions = sourceQuestions;
                sectionList[destSectionId].questions = destQuestions;
            }
        }
        return sectionList;
    }
}
