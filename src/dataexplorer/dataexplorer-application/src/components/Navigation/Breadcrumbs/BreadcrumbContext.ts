import { createContext, Dispatch, SetStateAction } from 'react';

interface IBreadcrumbContextProps {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    patientId: string;
    setPatientId: Dispatch<SetStateAction<string>>;
    schemaNumber: string;
    setSchemanumber: Dispatch<SetStateAction<string>>;
}
export const BreadcrumbContext = createContext<IBreadcrumbContextProps>({
    name: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setName: () => {},
    patientId: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setPatientId: () => {},
    schemaNumber: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setSchemanumber: () => {},
});

export const { Provider } = BreadcrumbContext;
