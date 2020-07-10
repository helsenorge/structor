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
    setName: () => {},
    patientId: '',
    setPatientId: () => {},
    schemaNumber: '',
    setSchemanumber: () => {},
});

export const { Provider } = BreadcrumbContext;
