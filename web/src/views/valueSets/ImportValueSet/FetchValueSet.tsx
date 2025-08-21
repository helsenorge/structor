import React, { useEffect, useState } from "react";

import { Bundle, BundleEntry, ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import createUUID from "src/helpers/CreateUUID";
import { useFetch } from "src/hooks/useFetch";
import FeedBack from "src/views/components/feedback/FeedBack";

import Button from "@helsenorge/designsystem-react/components/Button";
import Input from "@helsenorge/designsystem-react/components/Input";
import Loader from "@helsenorge/designsystem-react/components/Loader";

import styles from "./importValueSet.module.scss";
type Props = {
  setValueSets: React.Dispatch<
    React.SetStateAction<ValueSet[] | null | undefined>
  >;
};

const FetchValueSet = ({ setValueSets }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const { data, isLoading, error, fetchData, reset } = useFetch<Bundle>(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json+fhir",
      },
      mode: "cors",
    },
    false,
  );
  const handleChangeUrl = (value: string): void => {
    setUrl(value);
    if (value === "") {
      reset();
      setValueSets(null);
    }
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setValueSets(null);

    await fetchData();
  };
  useEffect(() => {
    if (data) {
      const valueSetFHIR = data?.entry
        ?.map(
          (bundleEntry: BundleEntry) =>
            bundleEntry.resource as ValueSet | undefined,
        )
        .filter(
          (fhirResource): fhirResource is ValueSet =>
            !!fhirResource && fhirResource.resourceType === "ValueSet",
        );

      const valueSets = valueSetFHIR?.map((valueSet) => {
        return {
          ...valueSet,
          id: !valueSet.id ? `pre-${createUUID()}` : valueSet.id,
          version: valueSet.version || "1.0",
          title: valueSet.title || valueSet.name,
        };
      });
      if (valueSets && valueSets.length > 0) {
        setValueSets((prev) => [...(prev || []), ...valueSets]);
      }
    }
  }, [data, setValueSets]);

  return (
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
      {isLoading && <Loader />}
      <FeedBack show={!!error} text={error!} variant="error" />
    </div>
  );
};
export default FetchValueSet;
