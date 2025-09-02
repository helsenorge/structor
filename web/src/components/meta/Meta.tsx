import React from "react";

import { Coding, Meta } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { toIsoOrUndefined } from "src/utils/dateUtils";

import Button from "@helsenorge/designsystem-react/components/Button";
import Expander from "@helsenorge/designsystem-react/components/Expander";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlusSmall from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import DatePicker from "@helsenorge/datepicker/components/DatePicker";

import { ProfileComponent } from "./ProfileComponent";
import CodingsComponent from "../coding/CodingsComponent";
import IdInput from "../valueInputs/IdInput";

import styles from "./meta.module.scss";
type Props = {
  meta?: Meta;
  updateMeta: (meta: Meta) => void;
  collapsable?: boolean;
};

const MetaComponent = ({
  meta,
  updateMeta,
  collapsable,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const handleChange = (newMeta: Meta): void => {
    updateMeta(newMeta);
  };
  const handleUpdateSecurity = (security?: Coding[]): void => {
    handleChange({ ...meta, security });
  };

  const handleUpdateTags = (tag?: Coding[]): void => {
    handleChange({ ...meta, tag });
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
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <Label labelTexts={[{ text: "Profile" }]} />
          <Button variant="borderless" onClick={() => handleAddProfile()}>
            <Icon svgIcon={PlusSmall} />
            {t("Add Profile")}
          </Button>
        </div>
        <ExpanderList className={styles.expanderList}>
          {meta?.profile?.map((profile, index) => {
            return collapsable ? (
              <Expander
                title={profile}
                key={profile}
                contentClassNames={styles.expanderItem}
                expanded={index === 0}
              >
                <ProfileComponent
                  profile={profile}
                  handleChange={handleChange}
                  meta={meta}
                />
              </Expander>
            ) : (
              <ProfileComponent
                profile={profile}
                handleChange={handleChange}
                meta={meta}
              />
            );
          })}
        </ExpanderList>
      </div>
      <div className={styles.securityContainer}>
        <CodingsComponent
          label={<Label labelTexts={[{ text: "Security" }]} />}
          updateCoding={(coding) => handleUpdateSecurity(coding)}
          codings={meta?.security}
          addText={t("Add Security")}
          collapsable
        />
      </div>
      <div className={styles.tagContainer}>
        <CodingsComponent
          label={<Label labelTexts={[{ text: "Tags" }]} />}
          updateCoding={(coding) => handleUpdateTags(coding)}
          codings={meta?.tag}
          addText={t("Add Tag")}
          collapsable
        />
      </div>
    </div>
  );
};
export default MetaComponent;
