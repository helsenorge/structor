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
import ItemButtons, { ItemButtonType } from '../AnchorMenu/ItemButtons/ItemButtons';

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
    const elementNumber = !!item
        ? calculateItemNumber(item.linkId, parentArray, state.qOrder, state.qItems)
        : undefined;
    const title = elementNumber ? `Element ${elementNumber}` : '';

    return (
        <>
            <Drawer visible={!!item} position="right" hide={closeDrawer} title={title}>
                <div className="item-button-row">
                    <div className="item-button-wrapper">
                        {hasPrevious() && (
                            <IconBtn type="back" title="Forrige (Pil venstre)" onClick={previous} color="black" />
                        )}
                    </div>
                    <div className="item-button-wrapper">
                        {hasNext() && <IconBtn type="forward" title="Neste (Pil høyre)" onClick={next} color="black" />}
                    </div>
                    {item && (
                        <div className="pull-right">
                            <ItemButtons
                                item={item}
                                parentArray={parentArray}
                                dispatch={dispatch}
                                buttons={[ItemButtonType.addChild, ItemButtonType.delete]}
                            />
                        </div>
                    )}
                </div>
                {item && (
                    <Question
                        key={`${item.linkId}`}
                        item={item}
                        parentArray={parentArray}
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
