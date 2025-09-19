import React from "react";

import {
  ErrorClassVariant,
  getSeverityClassByLevelAndType,
} from "src/components/Validation/validationHelper";
import { ErrorLevel } from "src/components/Validation/validationTypes";

import { ValidationError } from "../../../utils/validationUtils";

interface WarningMessagesProps {
  markdownWarning: ValidationError | undefined;
}

const WarningMessages = (props: WarningMessagesProps): React.JSX.Element => {
  const renderWarningMessage = (): React.JSX.Element => {
    return (
      <h3
        className={getSeverityClassByLevelAndType(
          ErrorLevel.warning,
          ErrorClassVariant.text,
        )}
      >
        {props.markdownWarning?.errorReadableText}
      </h3>
    );
  };

  return props.markdownWarning ? renderWarningMessage() : <></>;
};

export default WarningMessages;
