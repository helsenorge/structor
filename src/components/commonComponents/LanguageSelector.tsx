import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserContext } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

function LanguageSelector(): JSX.Element {
    const supportedLocales = ['en_US', 'nb_NO'];

    // TODO: Figure out how to do this without ignoring typescript and eslint-errors
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { locale, setLocale } = React.useContext(UserContext)!;
    const { i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    // TODO: Figure out how to do this without ignoring typescript and eslint-errors
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleMenuClick: MenuClickEventHandler = (event: { key: string }) => {
        if (supportedLocales.includes(event.key)) {
            setLocale(event.key);
            changeLanguage(event.key);
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="en_US">en_US</Menu.Item>
            <Menu.Item key="nb_NO">nb_NO</Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu}>
            <Button>
                {locale} <DownOutlined />
            </Button>
        </Dropdown>
    );
}
export default LanguageSelector;
