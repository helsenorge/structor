import React, { createContext, useReducer } from 'react';
import Section from '../../types/Section';
import Form, { SectionList } from '../../types/Form';
import * as DND from 'react-beautiful-dnd';
import { number } from 'prop-types';
import Question from '../../types/Question';

const initialState = {};
const store = createContext(initialState);

const { Provider } = store;

type Action =
    | {
          type: 'add';
          sectionList: SectionList;
          section: Section;
          lastIndex: number;
          index?: number;
      }
    | {
          type: 'remove';
          sectionList: SectionList;
          section: Section;
          lastIndex: number;
          index?: number;
      }
    | {
          type: 'reorder-sections';
          sectionList: SectionList;
          oldIndex: number;
          newIndex: number;
      }
    | {
          type: 'reorder-questions';
          list: Array<Question>;
          oldIndex: number;
          newIndex: number;
      }
    | {
          type: 'drag-end';
          sectionList: SectionList;
          result: DND.DropResult;
      };

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state: any, action: Action) => {
        switch (action.type) {
            case 'add':
                try {
                    return Form.addSection(
                        action.type.sectionList,
                        action.type.section,
                        action.type.index,
                    );
                } catch (e) {
                    console.log('Unable to add section');
                }
        }
    });
};

export const FormContext = React.createContext({
    sections: sectionList,
    addSection: addSection,
    removeSection: removeSection,
    onDragEnd: onDragEnd,
    getChildComponentStyle: getChildComponentStyle,
    getParentComponentStyle: getParentComponentStyle,
});
