import { FhirResource } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { useDownloadFile } from "src/hooks/useDownloadFile";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Change from "@helsenorge/designsystem-react/components/Icons/Change";
import DownLoad from "@helsenorge/designsystem-react/components/Icons/Download";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";

import RawJson from "../rawJson";

import styles from "./preview-fhir-resource.module.scss";

type Props = {
  fhirResource: FhirResource;
  resourceType: FhirResource["resourceType"];
  scrollToTarget?: () => void;
  handleEdit: (resource: FhirResource) => void;
  canEdit: boolean;
  canDownload?: boolean;
  canDelete?: boolean;
  deleteResource: (fhirResource: FhirResource) => void;
};

export const Preview = ({
  fhirResource,
  resourceType,
  scrollToTarget,
  handleEdit,
  canEdit,
  canDownload = true,
  canDelete = false,
  deleteResource,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { download } = useDownloadFile();
  return (
    <div>
      <h4>
        {resourceType} {" - "}
        {fhirResource.resourceType === "ValueSet" ||
        fhirResource.resourceType === "CodeSystem"
          ? fhirResource.name
          : fhirResource.id}
      </h4>
      <div className={styles.existingFhirResourceHeader}>
        {canEdit && (
          <Button
            ariaLabel="change resource"
            variant="borderless"
            onClick={() => {
              handleEdit(fhirResource);
              scrollToTarget?.();
            }}
          >
            <Icon svgIcon={Change} />
            {t("Edit Resource")}
          </Button>
        )}
        {canDownload && (
          <Button
            ariaLabel="download resource"
            variant="borderless"
            onClick={() =>
              download(
                JSON.stringify(fhirResource),
                `${fhirResource.resourceType === "ValueSet" || fhirResource.resourceType === "CodeSystem" ? fhirResource.name : fhirResource.id}.json`,
              )
            }
          >
            <Icon svgIcon={DownLoad} />
            {t("Download Resource")}
          </Button>
        )}
        {canDelete && (
          <div className={styles.deleteButton}>
            <Button
              ariaLabel="delete Resource"
              variant="borderless"
              concept="destructive"
              onClick={() => deleteResource(fhirResource)}
            >
              <Icon svgIcon={TrashCan} />
              {t("Delete Resource")}
            </Button>
          </div>
        )}
      </div>
      <RawJson jsonContent={fhirResource} showButton={false} />
    </div>
  );
};
export default Preview;
