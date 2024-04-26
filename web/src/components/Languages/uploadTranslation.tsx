import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { importCSV } from '../../helpers/importTranslations';
import { TreeContext } from '../../store/treeStore/treeStore';
import Btn from '../Btn/Btn';

const UploadTranslation = (): React.JSX.Element => {
    const { t } = useTranslation();
    const uploadTranslation = React.useRef<HTMLInputElement>(null);
    const { state, dispatch } = useContext(TreeContext);
    const [fileUploadError, setFileUploadError] = useState<string>('');
    const { qItems } = state;

    const onLoadUploadedTranslationFile = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
            try {
                importCSV(event.target.result as string, qItems, dispatch);
            } catch (error){
                console.error(error);
                setFileUploadError('Could not read uploaded file');
            }

            // Reset file input
            if (uploadTranslation.current) {
                uploadTranslation.current.value = '';
            }
        }
    };

    const uploadTranslationFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = onLoadUploadedTranslationFile;
        reader.onerror = () => {
            setFileUploadError('Could not read uploaded file');
        };
        if (event.target.files && event.target.files[0]) {
            reader.readAsText(event.target.files[0]);
            setFileUploadError('');
        }
    };

    return (
        <>
            <input
                type="file"
                ref={uploadTranslation}
                onChange={uploadTranslationFile}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ display: 'none' }}
            />
            <div>
                <Btn
                    title={t('Upload translation')}
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        uploadTranslation.current?.click();
                    }}
                />
            </div>
            {fileUploadError && (
                <ul className="item-validation-error-summary">
                    <li>{t(fileUploadError)}</li>
                </ul>
            )}
        </>
    );
}

export default UploadTranslation;