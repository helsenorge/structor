import React from 'react';
import { useTranslation } from 'react-i18next';
import { isSystemValid } from '../../helpers/systemHelper';
import FormField from './FormField';

type Props = {
    value: string | undefined;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const SystemField = ({ value, onBlur }: Props): JSX.Element => {
    const { t } = useTranslation();
    const ref = React.useRef<HTMLInputElement>(null);
    const [hasValidSystem, setHasValidSystem] = React.useState<boolean>(isSystemValid(value || ''));

    React.useEffect(() => {
        // if new value is sent as prop, set this as the current value
        if (ref.current) {
            ref.current.value = value || '';
        }
        setHasValidSystem(isSystemValid(value || ''));
    }, [value]);

    return (
        <FormField label={t('System')}>
            <input
                ref={ref}
                placeholder={t('Legg inn system..')}
                defaultValue={value || ''}
                onBlur={onBlur}
                onChange={(event) => {
                    setHasValidSystem(isSystemValid(event.target.value));
                }}
            />
            {!hasValidSystem && (
                <div className="msg-error" aria-live="polite">
                    {t('System må begynne med http://, https:// eller urn:')}
                </div>
            )}
        </FormField>
    );
};

export default SystemField;
