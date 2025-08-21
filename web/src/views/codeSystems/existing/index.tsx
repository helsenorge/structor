import { useTranslation } from "react-i18next";
import FeedBack from "src/views/components/feedback/FeedBack";
import { Preview } from "src/views/components/preview/Preview";

import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import useExistingCodeSystem from "./useExistionCodeSystem";

import styles from "./existing-code-systems.module.scss";
type Props = {
  navigateToNewTab: () => void;
};

const ExistingCodeSystems = ({
  navigateToNewTab,
}: Props): React.JSX.Element => {
  const { edit, deleteCodeSystem, codeSystems } = useExistingCodeSystem({
    navigateToNewTab,
  });
  const { t } = useTranslation();
  return (
    <div className={styles.existingCodeSystems}>
      {(codeSystems || []).length > 0 ? (
        <ExpanderList childPadding color="white">
          {codeSystems?.map((codeSystem, i) => (
            <ExpanderList.Expander
              key={codeSystem.id || i}
              expanded={i === 0}
              title={`${codeSystem.title} (${codeSystem.name || codeSystem.id})`}
            >
              <Preview
                deleteResource={() => deleteCodeSystem(codeSystem)}
                handleEdit={() => {
                  edit(codeSystem);
                }}
                canDelete={true}
                canDownload={true}
                canEdit={true}
                fhirResource={codeSystem}
                resourceType={codeSystem.resourceType}
              />
            </ExpanderList.Expander>
          ))}
        </ExpanderList>
      ) : (
        <FeedBack show text={t("no existing codeSystems found.")} />
      )}
    </div>
  );
};

export default ExistingCodeSystems;
