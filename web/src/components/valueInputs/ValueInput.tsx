import React from "react";

import type {
  ExtensionValueKey,
  ValueInputPropsMap,
} from "../extensions/types";

import BooleanInput from "./BooleanInput";
import CodeableConceptInput from "./CodeableConceptInput";
import CodingInput from "./CodingInput";
import DecimalInput from "./DecimalInput";
import DurationInput from "./DurationInput";
import IntegerInput from "./IntegerInput";
import { NotImplemented } from "./NotImplemented";
import QuantityInput from "./QuantityInput";
import StringInput from "./StringInput";

type ValueInputProps = ValueInputPropsMap[ExtensionValueKey];

const ValueInput = (props: ValueInputProps): React.JSX.Element => {
  const { type, value, onChange } = props;

  switch (type) {
    case "valueBoolean":
      return <BooleanInput value={value} onChange={onChange} />;
    case "valueInteger":
      return <IntegerInput value={value} onChange={onChange} />;
    case "valueDecimal":
      return <DecimalInput value={value} onChange={onChange} />;
    case "valueCoding":
      return <CodingInput value={value} onChange={onChange} />;
    case "valueCodeableConcept":
      return <CodeableConceptInput value={value} onChange={onChange} />;
    case "valueQuantity":
    case "valueDistance":
      return <QuantityInput value={value} onChange={onChange} />;
    case "valueDuration":
      return <DurationInput value={value} onChange={onChange} />;
    case "valueString":
    case "valueCode":
    case "valueDate":
    case "valueDateTime":
    case "valueTime":
    case "valueMarkdown":
      return <StringInput onChange={onChange} value={value} />;
    default:
      return <NotImplemented type={type} value={value} />;
  }
};

export default ValueInput;
