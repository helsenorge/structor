import { Meta } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import styles from "./meta.module.scss";

export const ProfileComponent = ({
  profile,
  handleChange,
  meta,
}: {
  profile: string;
  handleChange: (newMeta: Meta) => void;
  meta: Meta;
}): React.JSX.Element => {
  const { t } = useTranslation();
  const handleUpdateProfile = (profile: string): void => {
    const updatedProfiles = meta?.profile?.map((p) =>
      p === profile ? profile : p,
    );
    handleChange({ ...meta, profile: updatedProfiles });
  };
  return (
    <div key={profile} className={styles.profileItemContainer}>
      <Input
        key={profile}
        onChange={(event) => handleUpdateProfile(event.target.value)}
        value={profile}
      />
      <Button
        variant="borderless"
        concept="destructive"
        ariaLabel={t("Remove profile")}
        onClick={() =>
          handleChange({
            ...meta,
            profile: meta?.profile?.filter((p) => p !== profile),
          })
        }
      >
        <Icon svgIcon={TrashCan} />
      </Button>
    </div>
  );
};
