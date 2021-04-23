import React, { useContext } from 'react';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { getEnableWhenConditionals } from '../helpers/enableWhenValidConditional';
import { isIgnorableItem } from '../helpers/itemControl';
import { newItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import LanguageAccordion from '../components/Languages/LanguageAccordion';
import MetadataEditor from '../components/Metadata/MetadataEditor';
import Question from '../components/Question/Question';
import Sidebar from '../components/Sidebar/Sidebar';

const QuestionnaireEditor = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const dispatchNewRootItem = () => {
        dispatch(newItemAction(IQuestionnaireItemType.group, []));
    };

    const dispatchUpdateQuestionnaireMetadata = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const getConditional = (parentArray: string[], linkId: string): ValueSetComposeIncludeConcept[] => {
        return getEnableWhenConditionals(state, parentArray, linkId);
    };

    const getQItem = (linkId: string): QuestionnaireItem => {
        return state.qItems[linkId];
    };

    const removeUnsupportedChildren = (items: OrderItem[], parentArray: Array<string>) => {
        let parentItem: QuestionnaireItem;
        if (parentArray.length > 0) {
            parentItem = state.qItems[parentArray[parentArray.length - 1]];
        }
        return items.filter((x) => !isIgnorableItem(state.qItems[x.linkId], parentItem));
    };

    const renderTree = (
        items: Array<OrderItem>,
        questionArray: Array<JSX.Element>,
        parentArray: Array<string> = [],
        parentQuestionNumber = '',
    ): void => {
        removeUnsupportedChildren(items, parentArray).forEach((x, index) => {
            const questionNumber =
                parentQuestionNumber === '' ? `${index + 1}` : `${parentQuestionNumber}.${index + 1}`;

            const questionEl = (
                <Question
                    key={`${index}${x.linkId}`}
                    item={state.qItems[x.linkId]}
                    parentArray={parentArray}
                    questionNumber={questionNumber}
                    conditionalArray={getConditional(parentArray, x.linkId)}
                    getItem={getQItem}
                    containedResources={state.qContained}
                    dispatch={dispatch}
                />
            );
            questionArray.push(questionEl);

            renderTree(x.items, questionArray, [...parentArray, x.linkId], questionNumber);
        });
    };

    const flatQuestionArray: JSX.Element[] = [];
    renderTree(state.qOrder, flatQuestionArray);

    return (
        <>
            <div className="page-wrapper">
                <div className="form-intro">
                    <div className="form-intro-header">
                        <h2>Skjemainformasjon</h2>
                    </div>
                    <div className="form-intro-field">
                        <label htmlFor="questionnaire-title">Tittel:</label>
                        <br />
                        <input
                            placeholder="Tittel"
                            defaultValue={state.qMetadata.title}
                            id="questionnaire-title"
                            onBlur={(event) => {
                                dispatchUpdateQuestionnaireMetadata(
                                    IQuestionnaireMetadataType.title,
                                    event.target.value,
                                );
                            }}
                        />
                    </div>

                    <MetadataEditor />
                    <Sidebar />
                    <LanguageAccordion />
                </div>

                <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{flatQuestionArray}</div>
                <button className="section-button" onClick={dispatchNewRootItem}>
                    Legg til element
                </button>
            </div>
        </>
    );
};

export default QuestionnaireEditor;
