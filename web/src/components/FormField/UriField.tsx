import React from 'react';
import { useTranslation } from 'react-i18next';
import { isUriValid } from '../../helpers/uriHelper';

type Props = {
    value: string | undefined;
    disabled?: boolean;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const UriField = ({ value, disabled, onBlur }: Props): JSX.Element => {
    const { t } = useTranslation();
    const ref = React.useRef<HTMLInputElement>(null);
    const [hasValidUri, setHasValidUri] = React.useState<boolean>(isUriValid(value || ''));

    React.useEffect(() => {
        // if new value is sent as prop, set this as the current value
        if (ref.current) {
            ref.current.value = value || '';
        }
        setHasValidUri(!value || isUriValid(value || ''));
    }, [value]);

    return (
        <>
            <input
                disabled={disabled}
                ref={ref}
                placeholder={t('Enter uri..')}
                defaultValue={value || ''}
                onBlur={onBlur}
                onChange={(event) => {
                    setHasValidUri(!event.target.value || isUriValid(event.target.value));
                }}
            />
            {!hasValidUri && (
                <div className="msg-error" aria-live="polite">
                    {t('Uri must start with http://, https:// or urn:uuid:')}
                </div>
            )}
        </>
    );
};

export default UriField;
