import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserContext } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

function LanguageSelector(): JSX.Element {
    const supportedLocales = ['en_US', 'nb_NO'];

    const { locale, setLocale } = React.useContext(UserContext)!;
    const { i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    const handleMenuClick = (event: any) => {
        if (supportedLocales.includes(event.key)) {
            setLocale(event.key);
            const newlanguage = event.key.slice(0, 2);
            changeLanguage(newlanguage);
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="en_US">en_US</Menu.Item>
            <Menu.Item key="nb_NO">nb_NO</Menu.Item>
        </Menu>
    );
    return (
        <>
            <Dropdown overlay={menu}>
                <Button>
                    {locale} <DownOutlined />
                </Button>
            </Dropdown>
        </>
    );
}
export default LanguageSelector;
