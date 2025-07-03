import React, { useContext, useState } from "react";

import { BundleEntry, ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import Btn from "src/components/Btn/Btn";
import FormField from "src/components/FormField/FormField";
import createUUID from "src/helpers/CreateUUID";
import { getValueSetValues } from "src/helpers/valueSetHelper";
import { importValueSetAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";
import Input from "@helsenorge/designsystem-react/components/Input";

import AlertIcon from "../../../images/icons/alert-circle-outline.svg";

import styles from "./importValueSet.module.scss";

const ImportValueSet = (): React.JSX.Element => {
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { dispatch, state } = useContext(TreeContext);

  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [valueSets, setValueSets] = useState<ValueSet[] | null>();
  const [valueSetToAdd, setValueSetToAdd] = useState<string[]>([]);
  const [fileUploadError, setFileUploadError] = useState<string>("");

  async function fetchValueSets(): Promise<{
    valueSet?: ValueSet[];
    error?: string;
  }> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok || !response.json) {
      const message = `${t("There was en error with status:")} ${
        response.status
      }`;
      return { error: message };
    }

    const bundle = await response.json();

    if (bundle.resourceType !== "Bundle" || bundle.entry.length == 0) {
      return { error: t("This resource does not support the FHIR protocol") };
    }

    const valueSetFHIR: ValueSet[] = bundle.entry.map(
      (x: BundleEntry) => x.resource,
    );

    const valueSet = valueSetFHIR.map((x) => {
      return {
        resourceType: x.resourceType,
        id: !x.id ? `pre-${createUUID()}` : x.id,
        version: x.version || "1.0",
        name: x.name,
        title: x.title || x.name,
        status: x.status,
        publisher: x.publisher,
        compose: x.compose,
      };
    });

    setValueSetToAdd(valueSet.map((x) => x.id));

    return { valueSet };
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setValueSets(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetchValueSets();
      setTimeout(() => {
        setLoading(false);
        if (response.error) {
          setError(response.error);
          return;
        }
        if (response.valueSet?.length === 0) {
          setError(t("Found no ValueSet at the endpoint"));
          return;
        }
        setValueSets(response.valueSet);
      }, 1200);
    } catch {
      setError(t("This resource does not support the FHIR protocol"));
      setLoading(false);
    }
  };

  const handleChangeUrl = (value: string): void => {
    setUrl(value);

    if (value === "") {
      setError(null);
      setValueSets(null);
    }
  };

  const handleAddNewValueSet = (): void => {
    const valueSetsToImport = valueSets?.filter(
      (x) => x.id && valueSetToAdd.includes(x.id),
    );

    if (valueSetsToImport && valueSetsToImport?.length > 0) {
      dispatch(importValueSetAction(valueSetsToImport));
    }
    close();
  };

  const handleCheck = (checked: boolean, id?: string): void => {
    const itemToRemove = [...valueSetToAdd].findIndex((x) => x === id);
    if (checked && id) {
      setValueSetToAdd([...valueSetToAdd, id]);
    } else {
      const temList = [...valueSetToAdd];
      temList.splice(itemToRemove, 1);
      setValueSetToAdd(temList);
    }
  };

  const uploadValueSets = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files).map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (): void => resolve(reader.result);
          reader.onerror = (): void => {
            setFileUploadError("Could not read uploaded file");
          };

          reader.readAsText(file);
        });
      });
      const allFiles = await Promise.all(files);
      const toAdd: ValueSet[] = [];

      allFiles.forEach((fileObj) => {
        const resource = JSON.parse(fileObj as string);
        if (resource.resourceType === "Bundle" && resource.entry) {
          resource.entry.forEach((entry: BundleEntry) => {
            const entryResource = entry.resource as ValueSet;
            if (entryResource.resourceType === "ValueSet") {
              toAdd.push(entryResource);
            }
          });
        } else if (resource.resourceType === "ValueSet") {
          toAdd.push(resource);
        }
      });

      const filteredToAdd = toAdd.filter(
        (x) => state.qContained?.findIndex((y) => y.id === x.id) === -1,
      );
      setValueSets([...(valueSets || []), ...filteredToAdd]);
      setValueSetToAdd([
        ...valueSetToAdd,
        ...filteredToAdd.map((x) => x.id || ""),
      ]);

      if (uploadRef.current) {
        uploadRef.current.value = "";
      }
      setFileUploadError("");
    }
  };

  return (
    <div className={styles.importValueSet}>
      <div>
        <form className={styles.searchForm} onSubmit={(e) => handleSubmit(e)}>
          <Input
            label={t("Enter a location to import the ValueSets from")}
            placeholder="https:// .. /ValueSet or https:// .. /ValueSet/[id]"
            onChange={(e) => handleChangeUrl(e.target.value)}
            type="url"
            value={url}
            required
          />
          <div className={styles.buttonSearch}>
            <Button variant="outline" type="submit">
              {t("search")}
            </Button>
          </div>
        </form>

        <div>
          <input
            type="file"
            ref={uploadRef}
            onChange={uploadValueSets}
            accept="application/JSON"
            style={{ display: "none" }}
            multiple
          />
          <p>
            {t(
              "Upload ValueSets as json files. Accepts a Bundle or ValueSet in a single file. It is possible to upload several files at once",
            )}
          </p>
          <div className={styles.uploadButton}>
            <Button
              type="button"
              variant="fill"
              onClick={() => {
                uploadRef.current?.click();
              }}
            >
              {t("Upload ValueSet(s)")}
            </Button>
          </div>
          {fileUploadError && <div>{t(fileUploadError)}</div>}
        </div>
      </div>
      {loading && (
        <div className={styles.spinning}>
          <i className="ion-load-c" />
        </div>
      )}
      {error && (
        <p className="align-everything">
          <img height={25} alt="error" src={AlertIcon} /> {error}
        </p>
      )}
      {valueSets && (
        <div>
          {valueSets.map((x) => {
            return (
              <div key={x.id}>
                <p>
                  <input
                    type="checkbox"
                    aria-label="Add or remove value-set"
                    defaultChecked
                    onChange={(event) =>
                      handleCheck(event.target.checked, x?.id)
                    }
                  />{" "}
                  <strong>{x.title}</strong>
                </p>
                <ul>
                  {getValueSetValues(x).map((p) => (
                    <li key={p.code}>{`${p.display} (${p.code})`}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
      {valueSets && (
        <div className={styles.buttonBtn}>
          <div>
            <p>
              {t("Add ({0} ValueSet) in predefined valuesets").replace(
                "{0}",
                valueSetToAdd.length.toString(),
              )}
            </p>
            <Button
              variant="outline"
              type="button"
              onClick={handleAddNewValueSet}
            >
              {t("Import")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportValueSet;
