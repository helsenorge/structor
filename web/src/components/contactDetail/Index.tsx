import { ContactDetail, ContactPoint } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { initialTelecom } from "src/views/valueSets/utils/intialValuesets";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlusSmall from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import ContactPointInput from "../contactPoint/Index";

import styles from "./contact-detail.module.scss";

type Props = {
  contactDetail: ContactDetail | undefined;
  onChange: (
    field: keyof ContactDetail,
    value: ContactDetail[keyof ContactDetail] | undefined,
  ) => void;
  handleRemove: () => void;
};

const ContactDetailInput = ({
  contactDetail,
  onChange,
  handleRemove,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  const handleChange =
    (field: keyof ContactDetail) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange(field, event.target.value);
    };
  const updateContactPoint = (
    telecomIndex: number,
    telecom: ContactPoint,
  ): void => {
    if (contactDetail?.telecom?.[telecomIndex]) {
      onChange(
        "telecom",
        contactDetail.telecom.map((item, index) => {
          if (index === telecomIndex) {
            return telecom;
          }
          return item;
        }),
      );
    }
  };
  const addTelecom = (): void => {
    if (contactDetail) {
      onChange("telecom", [...(contactDetail.telecom || []), initialTelecom()]);
    }
  };
  const removeContactPoint = (index: number): void => {
    if (contactDetail) {
      onChange(
        "telecom",
        contactDetail?.telecom?.filter((_, i) => i !== index),
      );
    }
  };
  return (
    <div className={styles.contactDetail}>
      <div>
        <Input
          label="Name"
          value={contactDetail?.name}
          onChange={handleChange("name")}
        />
        <Button
          variant="borderless"
          ariaLabel={t("Add Contact")}
          onClick={addTelecom}
        >
          <Icon svgIcon={PlusSmall} /> {t("Add telecom")}
        </Button>
        {contactDetail?.telecom?.map((x, index) => (
          <ContactPointInput
            key={x.id}
            contactPoint={x}
            onChange={(field, value) =>
              updateContactPoint(index, { ...x, [field]: value })
            }
            removeContactPoint={() => removeContactPoint(index)}
          />
        ))}
      </div>
      <Button
        variant="borderless"
        onClick={handleRemove}
        ariaLabel={t("Remove include")}
        concept="destructive"
      >
        <Icon svgIcon={TrashCan} />
      </Button>
    </div>
  );
};
export default ContactDetailInput;
