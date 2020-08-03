import React, { ReactNode } from 'react';

const defaultLocale = 'en_US';

type UserContextType = {
    locale: string;
    setLocale: (value: string) => void;
};

type Props = {
    children: React.ReactNode;
};

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
    const [locale, setLocale] = React.useState(defaultLocale);

    return <UserContext.Provider value={{ locale, setLocale }}>{children}</UserContext.Provider>;
};
