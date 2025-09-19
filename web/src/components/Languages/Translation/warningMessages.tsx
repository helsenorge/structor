import React from "react";

import { ValidationError } from "../../../utils/validationUtils";

interface WarningMessagesProps {
  markdownWarning: ValidationError | undefined;
}

const WarningMessages = (props: WarningMessagesProps): React.JSX.Element => {
  const renderWarningMessage = (): React.JSX.Element => {
    return (
      <h3 className="warning-text">
        {props.markdownWarning?.errorReadableText}
      </h3>
    );
  };

  return props.markdownWarning ? renderWarningMessage() : <></>;
};

export default WarningMessages;
