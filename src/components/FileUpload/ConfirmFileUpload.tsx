import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import Confirm from '../Modal/Confirm';

type ConfirmFileUploadProps = {
    close: () => void;
    uploadRef: RefObject<HTMLInputElement>;
};

const ConfirmFileUpload = ({ close, uploadRef }: ConfirmFileUploadProps): JSX.Element => {
    const { t } = useTranslation();
    return (
        <Confirm
            onConfirm={() => {
                uploadRef.current?.click();
                close();
            }}
            onDeny={close}
            title={t('Remember to save...')}
        >
            <p>
                {t(
                    'You have made changes which are not saved. Do you with to upload a new questionnaire? (Changes will be lost)',
                )}
            </p>
        </Confirm>
    );
};

export default ConfirmFileUpload;
