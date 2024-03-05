import React from 'react';
import { ValidationErrors } from '../../../utils/validationUtils';

interface WarningMessagesProps {
    markdownWarning: ValidationErrors | undefined;
}

const WarningMessages = (props: WarningMessagesProps): React.JSX.Element => {
    const renderWarningMessage = (): React.JSX.Element => {
        return (
            <h3 className="msg-warning">
                {props.markdownWarning?.errorReadableText}
            </h3>
        );
    };

    return (props.markdownWarning ? (renderWarningMessage()): (<></>));
}

export default WarningMessages;