import React, { ReactNode, createContext, useState } from 'react';

const defaultLocale = 'en_US';

type UserContextType = {
    locale: string;
    setLocale: (value: string) => void;
};

type Props = {
    children: ReactNode;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props): JSX.Element => {
    const [locale, setLocale] = useState(defaultLocale);

    return <UserContext.Provider value={{ locale, setLocale }}>{children}</UserContext.Provider>;
};
