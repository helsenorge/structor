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
            title={t('Husk å lagre...')}
        >
            <p>
                {t(
                    'Du har gjort endringer som ikke er lagret. Ønsker du allikevel å laste opp et nytt skjema? (Endringene vil gå tapt)',
                )}
            </p>
        </Confirm>
    );
};

export default ConfirmFileUpload;
