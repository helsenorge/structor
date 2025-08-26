import React from "react";

import { Coding, Meta } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { toIsoOrUndefined } from "src/utils/dateUtils";
import { initialCoding } from "src/views/codeSystems/utils";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlusSmall from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import DatePicker from "@helsenorge/datepicker/components/DatePicker";

import CodingInput from "../extensions/valueInputs/CodingInput";
import IdInput from "../extensions/valueInputs/IdInput";

import styles from "./meta.module.scss";
type Props = {
  meta?: Meta;
  updateMeta: (meta: Meta) => void;
};

const MetaComponent = ({ meta, updateMeta }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const handleChange = (newMeta: Meta): void => {
    updateMeta(newMeta);
  };
  const handleUpdateSecurity = (security: Coding): void => {
    const updatedSecurity = meta?.security?.map((s) =>
      s.code === security.code ? security : s,
    );
    handleChange({ ...meta, security: updatedSecurity });
  };
  const handleAddSecurity = (): void => {
    const newSecurity: Coding = initialCoding();
    handleChange({
      ...meta,
      security: [...(meta?.security || []), newSecurity],
    });
  };
  const handleUpdateTag = (tag: Coding): void => {
    const updatedTags = meta?.tag?.map((t) => (t.code === tag.code ? tag : t));
    handleChange({ ...meta, tag: updatedTags });
  };
  const handleAddTag = (): void => {
    const newTag: Coding = initialCoding();
    handleChange({ ...meta, tag: [...(meta?.tag || []), newTag] });
  };
  const handleUpdateProfile = (profile: string): void => {
    const updatedProfiles = meta?.profile?.map((p) =>
      p === profile ? profile : p,
    );
    handleChange({ ...meta, profile: updatedProfiles });
  };
  const handleAddProfile = (): void => {
    const newProfile = "";
    handleChange({
      ...meta,
      profile: [...(meta?.profile || []), newProfile],
    });
  };
  return (
    <div className={styles.metaContainer}>
      <IdInput value={meta?.id} />
      <Input
        /*[A-Za-z0-9\-\.]{1,64} */ value={meta?.versionId}
        label={<Label labelTexts={[{ text: "VersionId" }]} />}
        onChange={(event) =>
          handleChange({ ...meta, versionId: event.target.value })
        }
      />
      <DatePicker
        label={<Label labelTexts={[{ text: "LastUpdated" }]} />}
        dateValue={meta?.lastUpdated ? new Date(meta?.lastUpdated) : undefined}
        onChange={(e, date) =>
          handleChange({ ...meta, lastUpdated: toIsoOrUndefined(date) })
        }
      />

      <Input
        value={meta?.source}
        label={<Label labelTexts={[{ text: "Source" }]} />}
        onChange={(event) =>
          handleChange({ ...meta, source: event.target.value })
        }
      />
      <div>
        <Label labelTexts={[{ text: "Profile" }]} />
        <Button variant="borderless" onClick={() => handleAddProfile()}>
          <Icon svgIcon={PlusSmall} />
          {t("Add Profile")}
        </Button>
        {meta?.profile?.map((profile) => {
          return (
            <div key={profile} className={styles.profileContainer}>
              <Input
                key={profile}
                onChange={(event) => handleUpdateProfile(event.target.value)}
                value={profile}
              />
              <Button
                variant="borderless"
                onClick={() =>
                  handleChange({
                    ...meta,
                    profile: meta?.profile?.filter((p) => p !== profile),
                  })
                }
              >
                <Icon svgIcon={TrashCan} />
                {t("Remove")}
              </Button>
            </div>
          );
        })}
      </div>
      <div>
        <Label labelTexts={[{ text: "Security" }]} />
        <Button variant="borderless" onClick={() => handleAddSecurity()}>
          <Icon svgIcon={PlusSmall} />
          {t("Add Security")}
        </Button>
        {meta?.security?.map((security) => {
          return (
            <div key={security.id} className={styles.securityTagContainer}>
              <CodingInput onChange={handleUpdateSecurity} value={security} />
              <Button
                variant="borderless"
                onClick={() =>
                  handleChange({
                    ...meta,
                    security: meta?.security?.filter(
                      (s) => s.id !== security.id,
                    ),
                  })
                }
              >
                <Icon svgIcon={TrashCan} />
                {t("Remove")}
              </Button>
            </div>
          );
        })}
      </div>
      <div>
        <Label labelTexts={[{ text: "Tags" }]} />
        <Button variant="borderless" onClick={() => handleAddTag()}>
          <Icon svgIcon={PlusSmall} />
          {t("Add Tag")}
        </Button>
        {meta?.tag?.map((tag) => {
          return (
            <div key={tag.id} className={styles.tagContainer}>
              <CodingInput
                key={tag.code}
                onChange={handleUpdateTag}
                value={tag}
              />
              <Button
                variant="borderless"
                onClick={() =>
                  handleChange({
                    ...meta,
                    tag: meta?.tag?.filter((t) => t.id !== tag.id),
                  })
                }
              >
                <Icon svgIcon={TrashCan} />
                {t("Remove")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MetaComponent;
