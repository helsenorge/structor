import React, { useContext } from 'react';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem, QuestionnaireItemInitial } from '../../../types/fhir';
import { IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import InitialInputTypeString from './InitialInputTypeString';
import InitialInputTypeInteger from './InitialInputTypeInteger';
import InitialInputTypeDecimal from './InitialInputTypeDecimal';
import InitialInputTypeBoolean from './InitialInputTypeBoolean';
import InitialInputTypeChoice from './InitialInputTypeChoice';

type InitialProps = {
    item: QuestionnaireItem;
};

const Initial = (props: InitialProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchUpdateItem = (value: QuestionnaireItemInitial | undefined) => {
        // TODO Support multiple QuestionnaireItemInitial
        const newInitial: QuestionnaireItemInitial[] | undefined = value ? [value] : undefined;
        dispatch(updateItemAction(props.item.linkId, IItemProperty.initial, newInitial));
    };

    function getInitialInput() {
        // TODO Support multiple QuestionnaireItemInitial
        const initial: QuestionnaireItemInitial | undefined = props.item.initial ? props.item.initial[0] : undefined;

        switch (props.item.type) {
            case IQuestionnaireItemType.string:
            case IQuestionnaireItemType.text:
                return <InitialInputTypeString initial={initial} dispatchAction={dispatchUpdateItem} />;
            case IQuestionnaireItemType.integer:
                return <InitialInputTypeInteger initial={initial} dispatchAction={dispatchUpdateItem} />;
            case IQuestionnaireItemType.quantity:
            case IQuestionnaireItemType.decimal:
                return <InitialInputTypeDecimal initial={initial} dispatchAction={dispatchUpdateItem} />;
            case IQuestionnaireItemType.boolean:
                return <InitialInputTypeBoolean initial={initial} dispatchAction={dispatchUpdateItem} />;
            case IQuestionnaireItemType.choice:
            case IQuestionnaireItemType.openChoice:
                return <InitialInputTypeChoice item={props.item} dispatchAction={dispatchUpdateItem} />;
        }
    }

    return <>{getInitialInput()}</>;
};

export default Initial;
