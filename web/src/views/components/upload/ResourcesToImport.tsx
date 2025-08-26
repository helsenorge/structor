import { FhirResource } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";

import { Preview } from "../preview/Preview";

type Props = {
  fhirResource: FhirResource;
  stateFhirResource: FhirResource[] | undefined;
  handleAddNewResource: (id: string) => void;
  resourceType: FhirResource["resourceType"];
};

export const ResourcesToImport = ({
  fhirResource,
  stateFhirResource,
  handleAddNewResource,
  resourceType,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div key={fhirResource.id}>
      {fhirResource.id &&
        (stateFhirResource?.findIndex((y) => y.id === fhirResource.id) ===
        -1 ? (
          <Button
            variant="outline"
            type="button"
            onClick={() => handleAddNewResource(fhirResource.id!)}
            ariaLabel={t("Import resource")}
            data-testid="import-resource-button"
          >
            {t("Import resource")}
          </Button>
        ) : (
          <p data-testid="already-imported">{t("Already imported")}</p>
        ))}
      <Preview
        fhirResource={fhirResource}
        resourceType={resourceType}
        canEdit={false}
        handleEdit={() => {}}
        deleteResource={() => {}}
        canDelete={false}
        canDownload={true}
      />
    </div>
  );
};
export default ResourcesToImport;
