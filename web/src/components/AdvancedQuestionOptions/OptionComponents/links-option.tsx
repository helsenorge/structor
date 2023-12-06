import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "../../../types/fhir";
import { useTranslation } from "react-i18next";
import HyperlinkTargetElementToggle from "../HyperlinkTargetElementToggle";

type LinksOptionProps = {
    item: QuestionnaireItem;
};

export const LinksOption = ({item}: LinksOptionProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="horizontal full">
                <FormField
                    label={t('Links')}
                    sublabel={t('Choose whether the links in the components should be opened in an external window')}
                ></FormField>
            </div>
            <HyperlinkTargetElementToggle item={item} />
        </>
    )
}