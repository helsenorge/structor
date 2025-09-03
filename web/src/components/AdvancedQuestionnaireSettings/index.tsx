import { useContext } from "react";

import { Coding, Extension, Meta } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { useValidationContext } from "src/contexts/validation/useValidationContext";
import { updateQuestionnaireMetadataAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadataType } from "src/types/IQuestionnaireMetadataType";

import Expander, {
  ExpanderSize,
} from "@helsenorge/designsystem-react/components/Expander";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import Accordion from "../Accordion/Accordion";
import CodingsComponent from "../coding/CodingsComponent";
import { Extensions } from "../extensions/Extensions";
import MetaComponent from "../meta/Meta";
import { ValidationType } from "../Validation/validationTypes";

import style from "./advanced-questionnaire-settings.module.scss";

const AdvancedQuestionnaireSettings = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const { questionnaireDetailsErrors } = useValidationContext();
  const handleUpdateExtensions = (extensions: Extension[]): void => {
    dispatch(
      updateQuestionnaireMetadataAction(
        IQuestionnaireMetadataType.extension,
        extensions,
      ),
    );
  };
  const handleUpdateCodings = (codings?: Coding[]): void => {
    if (codings)
      dispatch(
        updateQuestionnaireMetadataAction(
          IQuestionnaireMetadataType.code,
          codings,
        ),
      );
  };
  const handleUpdateMeta = (meta: Meta): void => {
    dispatch(
      updateQuestionnaireMetadataAction(IQuestionnaireMetadataType.meta, meta),
    );
  };
  const codeErrors = questionnaireDetailsErrors.filter(
    (X) => X.errorProperty === ValidationType.questionnaireCode,
  );
  return (
    <Accordion
      title={t("Advanced Questionnaire Settings")}
      className={style.accordion}
    >
      <ExpanderList accordion className={style.expanderList}>
        <Expander
          size={ExpanderSize.large}
          title={t("Meta")}
          contentClassNames={style.extensionExpanderItem}
        >
          <MetaComponent
            updateMeta={handleUpdateMeta}
            meta={state.qMetadata.meta}
            collapsable
          />
        </Expander>
        <Expander
          size={ExpanderSize.large}
          title={t("Extension")}
          contentClassNames={style.extensionExpanderItem}
        >
          <Extensions
            collapsable
            className={style.extensions}
            extensions={state.qMetadata.extension}
            updateExtensions={handleUpdateExtensions}
            id={"undefined"}
          />
        </Expander>
        <Expander
          size={ExpanderSize.large}
          title={t("Code")}
          contentClassNames={style.extensionExpanderItem}
        >
          <CodingsComponent
            codings={state.qMetadata.code}
            updateCoding={handleUpdateCodings}
            hasValidationError={(index: number) =>
              codeErrors.some((x) => x.index === index)
            }
            collapsable
          />
        </Expander>
      </ExpanderList>
    </Accordion>
  );
};

export default AdvancedQuestionnaireSettings;
