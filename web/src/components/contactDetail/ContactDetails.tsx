import { ContactDetail } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import Label from "@helsenorge/designsystem-react/components/Label";

import ContactDetailInput from "./Index";

type Props = {
  contacts: ContactDetail[] | undefined;
  handleUpdate: (
    field: keyof ContactDetail,
    value: ContactDetail[keyof ContactDetail] | undefined,
    index: number,
  ) => void;
  handleAdd: () => void;
  handleRemove: (index: number) => void;
};

const ContactDetails = ({
  contacts,
  handleUpdate,
  handleAdd,
  handleRemove,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  const handleContactChange = (
    index: number,
    field: keyof ContactDetail,
    value: ContactDetail[keyof ContactDetail] | undefined,
  ): void => {
    handleUpdate(field, value, index);
  };

  return (
    <div>
      <Label labelTexts={[{ text: "Contacts" }]} />
      <Button
        variant="borderless"
        ariaLabel={t("Add contact")}
        onClick={() => handleAdd()}
      >
        <Icon svgIcon={PlussIcon} /> {t("Add contact")}
      </Button>
      {contacts?.map((contact, index) => {
        return (
          <ContactDetailInput
            key={contact.id || contact.name}
            contactDetail={contact}
            onChange={(field, value) =>
              handleContactChange(index, field, value)
            }
            handleRemove={() => handleRemove(index)}
          />
        );
      })}
    </div>
  );
};
export default ContactDetails;
