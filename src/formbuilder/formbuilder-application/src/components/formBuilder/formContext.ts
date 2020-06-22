import React from 'react';
import * as DND from 'react-beautiful-dnd';
import Section from '../../types/Section';
import InvalidArgumentException from '../../types/InvalidArgumentException';
import Question from '../../types/Question';

let sectionList: { [sectionNumber: number]: Section } = [];

const addSection = (section: Section, index?: number) => {
    if (!section) throw new InvalidArgumentException('No section was provided');
};

const removeSection = (index: number) => {
    if (!index) throw new InvalidArgumentException('No index was provided');
};

const reorderSections = (
    list: { [sectionNumber: number]: Section },
    oldIndex: number,
    newIndex: number,
) => {
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
};

const reorderQuestions = (
    list: Array<Question>,
    oldIndex: number,
    newIndex: number,
) => {
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
};

// TODO: Fix return and draggebleStyle types
const getChildComponentStyle = (
    isDragging: boolean,
    draggableStyle: Array<unknown>,
): unknown => ({
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
});

// TODO: Fix return types
const getParentComponentStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 8,
    margin: '10px 0',
});

const onDragEnd = (result: DND.DropResult) => {
    if (!result.destination) {
        return;
    }
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (result.type === 'droppableItem') {
        sectionList = reorderSections(sectionList, sourceIndex, destIndex);
    } else if (result.type === 'droppableSubItem') {
        const sourceSectionId = parseInt(result.source.droppableId);
        const destSectionId = parseInt(result.destination.droppableId);

        const sourceQuestions = sectionList[sourceSectionId].questions;
        const destQuestions = sectionList[destSectionId].questions;

        if (sourceSectionId === destSectionId) {
            const reorderedQuestions = reorderQuestions(
                sourceQuestions,
                sourceIndex,
                destIndex,
            );
            sectionList[sourceSectionId].questions = reorderedQuestions;
        } else {
            const draggedItem = sourceQuestions.splice(sourceIndex, 1);

            destQuestions.splice(destIndex, 0, draggedItem);

            sectionList[sourceSectionId] = sourceSectionId;
            sectionList[destSectionId] = destQuestions;
        }
    }
};

export const SectionContext = React.createContext({
    sections: sectionList,
    addSection: addSection,
    removeSection: removeSection,
    getChildComponentStyle: getChildComponentStyle,
    getParentComponentStyle: getParentComponentStyle,
});
