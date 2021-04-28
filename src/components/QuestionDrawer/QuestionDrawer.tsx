import React, { useContext, useRef } from 'react';
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
import useOutsideClick from '../../hooks/useOutsideClick';
import Drawer from '../Drawer/Drawer';

const QuestionDrawer = (): JSX.Element | null => {
    const { state, dispatch } = useContext(TreeContext);
    const { previous, next, hasNext, hasPrevious } = useItemNavigation();
    const closeDrawer = () => {
        dispatch(updateMarkedLinkIdAction());
    };

    const disableEventListeners = !state.qCurrentItem?.linkId;

    // Click outside
    const drawerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(drawerRef, closeDrawer, disableEventListeners);

    // Keyboard navigation
    useKeyPress('ArrowLeft', previous, disableEventListeners);
    useKeyPress('ArrowRight', next, disableEventListeners);
    useKeyPress('Escape', closeDrawer, disableEventListeners);

    const getConditional = (ancestors: string[], linkId: string): ValueSetComposeIncludeConcept[] => {
        return getEnableWhenConditionals(state, ancestors, linkId);
    };

    const getQItem = (linkId: string): QuestionnaireItem => {
        return state.qItems[linkId];
    };

    const item = state.qCurrentItem?.linkId ? state.qItems[state.qCurrentItem?.linkId] : undefined;
    const parentArray = state.qCurrentItem?.parentArray || [];

    return (
        <>
            <Drawer visible={!!item} position="right" hide={closeDrawer}>
                <div className="item-navigation-buttons">
                    <div>
                        {hasPrevious() && (
                            <IconBtn type="back" title="Forrige (Pil venstre)" onClick={previous} color="black" />
                        )}
                    </div>
                    <div>
                        {hasNext() && <IconBtn type="forward" title="Neste (Pil høyre)" onClick={next} color="black" />}
                    </div>
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
            </Drawer>
        </>
    );
};

export default QuestionDrawer;
