import React, { useContext, useState } from "react";

import { BundleEntry, FhirResource, Questionnaire } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getFhirResourcesFromState } from "src/store/treeStore/selectors";
import { importFhirResourceAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";

import ResourcesToImport from "./ResourcesToImport";
import FeedBack from "../feedback/FeedBack";

import styles from "./upload-fhir-resource.module.scss";

type Props = {
  resourceType: FhirResource["resourceType"];
};

const UploadFhirResource = ({ resourceType }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const [fhirResource, setFhirResource] = useState<FhirResource[] | null>(null);
  const { state } = useContext(TreeContext);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const [fileUploadError, setFileUploadError] = useState<string>("");
  const { dispatch } = useContext(TreeContext);
  const [isDragging, setIsDragging] = useState(false);

  const handleAddNewFhirResource = (id: string): void => {
    const fhirResourcesToImport = fhirResource
      ?.filter((x) => x?.id === id)
      .filter(
        (obj, index, self) =>
          index ===
          self.findIndex(
            (t) => t.id === obj.id && t.resourceType === obj.resourceType,
          ),
      );
    if (fhirResourcesToImport && fhirResourcesToImport?.length > 0) {
      dispatch(importFhirResourceAction(fhirResourcesToImport));
    }
  };
  const stateFhirResource = getFhirResourcesFromState(state, resourceType);
  const processFiles = async (files: FileList | null): Promise<void> => {
    if (!files || files.length === 0) {
      return;
    }

    const filePromises = Array.from(files).map((file) => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = (): void => resolve(reader.result);
        reader.onerror = (): void => {
          setFileUploadError("Could not read uploaded file: " + file.name);
          reject(new Error("File read error"));
        };
        reader.readAsText(file);
      });
    });

    try {
      const allFiles = await Promise.all(filePromises);
      const toAdd: FhirResource[] = allFiles.flatMap((fileObj) => {
        try {
          const resource = JSON.parse(fileObj as string);
          if (resource.resourceType === "Bundle" && resource.entry) {
            const resourcesInBundle = resource.entry
              .filter(
                (entry: BundleEntry) =>
                  entry.resource?.resourceType === resourceType,
              )
              .map((entry: BundleEntry) => entry.resource)
              .filter(Boolean);
            const resourcesInQuestionnaires = resource.entry
              .filter(
                (entry: BundleEntry) =>
                  entry.resource?.resourceType === "Questionnaire",
              )
              .map((entry: BundleEntry<Questionnaire>) => {
                return entry.resource?.contained?.filter(
                  (containedResource: FhirResource) =>
                    containedResource.resourceType === resourceType,
                );
              })
              .filter(Boolean);

            return (
              [...resourcesInBundle, ...resourcesInQuestionnaires].flat(
                Infinity,
              ) as FhirResource[]
            ).filter((n, i, arr) => arr.indexOf(n) === i);
          } else if (resource.resourceType === "Questionnaire") {
            return (
              resource.contained
                ?.filter(
                  (containedResource: FhirResource) =>
                    containedResource.resourceType === resourceType,
                )
                .map((containedResource: FhirResource) => containedResource) ||
              []
            );
          } else if (resource.resourceType === resourceType) {
            return [resource];
          }
        } catch (e) {
          setFileUploadError(
            "One of the files is not valid JSON and was skipped.",
          );
        }
        return [];
      });

      const filteredToAdd = toAdd
        .filter((x) => {
          return stateFhirResource.findIndex((y) => y?.id === x?.id) === -1;
        })
        .filter(
          (obj, index, self) =>
            index ===
            self.findIndex(
              (t) => t.id === obj.id && t.resourceType === obj.resourceType,
            ),
        );
      if (toAdd.length > 0 && filteredToAdd.length === 0) {
        setFileUploadError(
          "All uploaded resources are already in the questionnaire.",
        );
      } else {
        setFileUploadError("");
      }
      setFhirResource((prev) => [...(prev || []), ...filteredToAdd]);

      if (uploadRef.current) {
        uploadRef.current.value = "";
      }
    } catch (error) {
      setFileUploadError((error as Error)?.message || "Unknown error occurred");
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    processFiles(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    setFileUploadError("");
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    setFileUploadError("");
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setFileUploadError("");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;
    processFiles(droppedFiles);
  };
  const feedBackText = t(
    "Upload [0] as json files. Accepts a Bundle/Questionnaire or [0] in a single file. It is possible to upload several files at once",
  );
  return (
    <div className={styles.uploadFhirResource}>
      <div>
        <input
          type="file"
          ref={uploadRef}
          onChange={handleFileSelect}
          accept="application/JSON"
          style={{ display: "none" }}
          multiple
        />
        <FeedBack show text={feedBackText.replace(/\[0]/g, resourceType)} />
        <div
          className={`${styles.uploadButton} ${isDragging ? styles.isDragging : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <h3>{t("Drag and drop your files here, or...")}</h3>
          <Button
            ariaLabel={t("Select files")}
            type="button"
            variant="fill"
            onClick={() => {
              uploadRef.current?.click();
              setFileUploadError("");
            }}
          >
            {t("Select files")}
          </Button>
        </div>
      </div>
      <FeedBack
        show={!!fileUploadError}
        text={t(fileUploadError!)}
        variant="error"
      />
      {fhirResource && fhirResource.length > 0 && (
        <div>
          <h3>{t(`Available ${resourceType}`)}</h3>
          <div className={styles.fhirResourceList}>
            {fhirResource?.filter(Boolean).map((resource) => {
              return (
                <ResourcesToImport
                  key={resource?.id}
                  fhirResource={resource}
                  stateFhirResource={stateFhirResource}
                  handleAddNewResource={handleAddNewFhirResource}
                  resourceType={resourceType}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default UploadFhirResource;
