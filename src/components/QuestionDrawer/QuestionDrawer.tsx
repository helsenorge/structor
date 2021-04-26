import React, { useContext } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
import './QuestionDrawer.css';
import { calculateItemNumber } from '../../helpers/treeHelper';
import Question from '../Question/Question';
import { getEnableWhenConditionals } from '../../helpers/enableWhenValidConditional';
import { updateMarkedLinkIdAction } from '../../store/treeStore/treeActions';
import IconBtn from '../IconBtn/IconBtn';
import { useItemNavigation } from '../../hooks/useItemNavigation';
import { useKeyPress } from '../../hooks/useKeyPress';

// type QuestionDrawerProps = {};

const QuestionDrawer = (/*props: QuestionDrawerProps*/): JSX.Element | null => {
    const { state, dispatch } = useContext(TreeContext);
    const { previous, next, hasNext, hasPrevious } = useItemNavigation();
    const close = () => {
        dispatch(updateMarkedLinkIdAction());
    };

    useKeyPress('ArrowLeft', previous);
    useKeyPress('ArrowRight', next);
    useKeyPress('Escape', close);

    const getConditional = (parentArray: string[], linkId: string): ValueSetComposeIncludeConcept[] => {
        return getEnableWhenConditionals(state, parentArray, linkId);
    };

    const getQItem = (linkId: string): QuestionnaireItem => {
        return state.qItems[linkId];
    };

    const additionalClassNames = state.qCurrentItem ? 'open' : '';
    const item = state.qCurrentItem?.linkId ? state.qItems[state.qCurrentItem?.linkId] : undefined;
    const parentArray = state.qCurrentItem?.parentArray || [];

    return (
        <>
            {item && <div className="overlay" />}
            <div className={`right-drawer ${additionalClassNames}`}>
                <div className="drawer-header">
                    <IconBtn type="x" title="Lukk (Esc)" onClick={close} />
                    {hasPrevious() && <IconBtn type="back" title="Forrige (Pil venstre)" onClick={previous} />}
                    {hasNext() && <IconBtn type="forward" title="Neste (Pil høyre)" onClick={next} />}
                </div>
                {item && (
                    <Question
                        key={`${item.linkId}`}
                        item={item}
                        parentArray={parentArray}
                        questionNumber={calculateItemNumber(item.linkId, parentArray, state.qOrder, state.qItems)}
                        conditionalArray={getConditional(parentArray, item.linkId)}
                        getItem={getQItem}
                        containedResources={state.qContained}
                        dispatch={dispatch}
                    />
                )}
            </div>
        </>
    );
};

export default QuestionDrawer;
