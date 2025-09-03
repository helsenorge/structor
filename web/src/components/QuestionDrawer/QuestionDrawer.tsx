import React, { useContext, useRef } from "react";

import { QuestionnaireItem, ValueSetComposeIncludeConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";

import "./QuestionDrawer.css";
import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import ChevronLeft from "@helsenorge/designsystem-react/components/Icons/ChevronLeft";
import ChevronRight from "@helsenorge/designsystem-react/components/Icons/ChevronRight";

import { getEnableWhenConditionals } from "../../helpers/enableWhenValidConditional";
import { calculateItemNumber } from "../../helpers/treeHelper";
import { useItemNavigation } from "../../hooks/useItemNavigation";
import { useKeyPress } from "../../hooks/useKeyPress";
import useOutsideClick from "../../hooks/useOutsideClick";
import { updateMarkedLinkIdAction } from "../../store/treeStore/treeActions";
import { TreeContext } from "../../store/treeStore/treeStore";
import { ValidationError } from "../../utils/validationUtils";
import { generateItemButtons } from "../AnchorMenu/ItemButtons/ItemButtons";
import Drawer from "../Drawer/Drawer";
import IconBtn from "../IconBtn/IconBtn";
import Question from "../Question/Question";

interface Props {
  validationErrors: ValidationError[];
}

const QuestionDrawer = ({
  validationErrors,
}: Props): React.JSX.Element | null => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const { previous, next, hasNext, hasPrevious } = useItemNavigation();
  const closeDrawer = (): void => {
    setTimeout(() => {
      dispatch(updateMarkedLinkIdAction());
    }, 100);
  };

  const disableEventListeners = !state.qCurrentItem?.linkId;

  // Click outside
  const drawerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(drawerRef, closeDrawer, disableEventListeners);

  // Keyboard navigation
  useKeyPress("ArrowLeft", previous, disableEventListeners);
  useKeyPress("ArrowRight", next, disableEventListeners);
  useKeyPress("Escape", closeDrawer, disableEventListeners);

  const getConditional = (
    ancestors: string[],
    linkId: string,
  ): ValueSetComposeIncludeConcept[] => {
    return getEnableWhenConditionals(state, ancestors, linkId);
  };

  const getQItem = (linkId: string): QuestionnaireItem => {
    return state.qItems[linkId];
  };

  const item = state.qCurrentItem?.linkId
    ? state.qItems[state.qCurrentItem?.linkId]
    : undefined;
  const parentArray = state.qCurrentItem?.parentArray || [];
  const elementNumber = item
    ? calculateItemNumber(item.linkId, parentArray, state.qOrder, state.qItems)
    : undefined;
  const title = elementNumber ? `Element ${elementNumber}` : "";
  const itemValidationErrors = validationErrors.filter(
    (error) => error.linkId === item?.linkId,
  );

  return (
    <Drawer visible={!!item} position="right" hide={closeDrawer} title={title}>
      <div className="item-button-row">
        <div className="item-button-wrapper">
          {hasPrevious() && (
            <Button
              variant="borderless"
              ariaLabel={t("Previous (left arrow)")}
              onClick={previous}
            >
              <Icon color="black" svgIcon={ChevronLeft} />
            </Button>
          )}
        </div>
        <div className="item-button-wrapper">
          {hasNext() && (
            <Button
              ariaLabel={t("Next (right arrow)")}
              onClick={next}
              variant="borderless"
            >
              <Icon color="black" svgIcon={ChevronRight} />
            </Button>
          )}
        </div>
        {item && (
          <div className="pull-right">
            {generateItemButtons(t, item, parentArray, true, dispatch)}
          </div>
        )}
      </div>
      {itemValidationErrors.length > 0 && (
        <div className="item-validation-error-summary">
          <div>{t("Validation errors:")}</div>
          <ul>
            {itemValidationErrors.map((error, index) => {
              return <li key={index}>{error.errorReadableText}</li>;
            })}
          </ul>
        </div>
      )}
      {item && (
        <Question
          key={`${item.linkId}`}
          item={item}
          formExtensions={state.qMetadata.extension}
          parentArray={parentArray}
          conditionalArray={getConditional(parentArray, item.linkId)}
          getItem={getQItem}
          containedResources={state.qContained}
          dispatch={dispatch}
          itemValidationErrors={itemValidationErrors}
        />
      )}
    </Drawer>
  );
};

export default QuestionDrawer;
