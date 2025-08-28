import { ContactPoint, Period } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { toIsoOrUndefined } from "src/utils/dateUtils";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Select from "@helsenorge/designsystem-react/components/Select";

import DatePicker from "@helsenorge/datepicker/components/DatePicker";

import styles from "./contact-point.module.scss";
type Props = {
  contactPoint: ContactPoint;
  onChange: (
    field: keyof ContactPoint,
    value: ContactPoint[keyof ContactPoint],
  ) => void;
  removeContactPoint: () => void;
};
const ContactPointInput = ({
  contactPoint,
  onChange,
  removeContactPoint,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  const handleChange =
    (field: keyof ContactPoint) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      onChange(field, event.target.value);
    };
  const handleChangePeriod =
    (field: keyof Period) =>
    (
      _event:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<Element, MouseEvent>
        | React.KeyboardEvent<Element>,
      date?: Date | string,
    ): void => {
      onChange("period", {
        [field]: toIsoOrUndefined(date),
      });
    };

  return (
    <div className={styles.contactPoint}>
      <div>
        <Select
          value={contactPoint.system}
          label="System"
          onChange={handleChange("system")}
        >
          <option value="phone">{"Phone"}</option>
          <option value="fax">{"Fax"}</option>
          <option value="email">{"Email"}</option>
          <option value="pager">{"Pager"}</option>
          <option value="url">{"Url"}</option>
          <option value="sms">{"Sms"}</option>
          <option value="other">{"Other"}</option>
        </Select>
        <Input
          label="Value"
          value={contactPoint.value}
          onChange={handleChange("value")}
        />
        <Select
          value={contactPoint.use}
          label="Use"
          onChange={handleChange("use")}
        >
          <option value="home">{"Home"}</option>
          <option value="work">{"Work"}</option>
          <option value="temp">{"Temp"}</option>
          <option value="old">{"Old"}</option>
          <option value="mobile">{"Mobile"}</option>
        </Select>
        <Input
          min={0}
          label="Rank"
          value={contactPoint.rank}
          onChange={handleChange("rank")}
        />
        <div className={styles.contactpointPeriod}>
          <DatePicker
            label={t("Start date")}
            dateValue={
              contactPoint.period?.start
                ? new Date(contactPoint.period.start)
                : undefined
            }
            onChange={handleChangePeriod("start")}
          />
          <DatePicker
            label={t("End date")}
            dateValue={
              contactPoint.period?.end
                ? new Date(contactPoint.period.end)
                : undefined
            }
            onChange={handleChangePeriod("end")}
          />
        </div>
      </div>
      <Button
        variant="borderless"
        onClick={removeContactPoint}
        ariaLabel={t("Remove telecom")}
        concept="destructive"
      >
        <Icon svgIcon={TrashCan} />
      </Button>
    </div>
  );
};
export default ContactPointInput;
