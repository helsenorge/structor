import React, { useContext } from 'react';
import itemType from '../../../helpers/QuestionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem, QuestionnaireItemEnableWhen, ValueSetComposeIncludeConcept } from '../../../types/fhir';
import { IEnableWhen, IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import EnableWhenTypeBoolean from './EnableWhenTypeBoolean';
import EnableWhenTypeChoice from './EnableWhenTypeChoice';
import EnableWhenTypeDate from './EnableWhenTypeDate';
import EnableWhenTypeDateTime from './EnableWhenTypeDateTime';
import EnableWhenTypeInteger from './EnableWhenTypeInteger';
import EnableWhenTypeTime from './EnableWhenTypeTime';

type Props = {
    conditionItem: QuestionnaireItem;
    itemEnableWhen: QuestionnaireItemEnableWhen;
    linkId: string;
};

const EnableWhenTypes = ({ conditionItem, itemEnableWhen, linkId }: Props): JSX.Element => {
    if (conditionItem.type == undefined) {
        debugger;
    }
    const param = conditionItem.type;
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: IEnableWhen[]) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };

    switch (param) {
        case IQuestionnaireItemType.integer:
            return (
                <EnableWhenTypeInteger
                    conditionItem={conditionItem}
                    itemEnableWhen={itemEnableWhen}
                    dispatch={dispatchUpdateItemEnableWhen}
                />
            );
        case IQuestionnaireItemType.choice:
            const choices = (conditionItem.answerOption || []).map((x) => {
                return { code: x.valueCoding.code || '', display: x.valueCoding.display };
            }) as ValueSetComposeIncludeConcept[];

            return (
                <EnableWhenTypeChoice
                    choices={choices}
                    conditionItem={conditionItem}
                    itemEnableWhen={itemEnableWhen}
                    dispatch={dispatchUpdateItemEnableWhen}
                />
            );
        case IQuestionnaireItemType.boolean:
            return (
                <EnableWhenTypeBoolean
                    conditionItem={conditionItem}
                    itemEnableWhen={itemEnableWhen}
                    dispatch={dispatchUpdateItemEnableWhen}
                />
            );
        case IQuestionnaireItemType.date:
            return (
                <EnableWhenTypeDate
                    conditionItem={conditionItem}
                    itemEnableWhen={itemEnableWhen}
                    dispatch={dispatchUpdateItemEnableWhen}
                />
            );
        case IQuestionnaireItemType.time:
            return (
                <EnableWhenTypeTime
                    conditionItem={conditionItem}
                    itemEnableWhen={itemEnableWhen}
                    dispatch={dispatchUpdateItemEnableWhen}
                />
            );
        case IQuestionnaireItemType.dateTime:
            return (
                <EnableWhenTypeDateTime
                    conditionItem={conditionItem}
                    itemEnableWhen={itemEnableWhen}
                    dispatch={dispatchUpdateItemEnableWhen}
                />
            );
        default:
            return (
                <p>
                    Skjemabyggeren supporterer ikke betinget visning av typen:{' '}
                    <strong>{itemType.find((x) => x.code === param)?.display || param}</strong>
                </p>
            );
    }
};

export default EnableWhenTypes;
