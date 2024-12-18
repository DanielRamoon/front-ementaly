import moment from 'moment';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider, useIntl } from 'react-intl';

import AxiosInstance from '../apis/AxiosInstance';

interface ILanguageContext {
  locale: string;
  changeLanguage: (newLocale: string) => void;
}

interface ILanguageProvider {
  initLocale?: string;
  messages: any;
}

export const LanguageContext = createContext({} as ILanguageContext);

export const LanguageProvider: React.FC<ILanguageProvider> = ({
  children,
  initLocale,
  messages,
}) => {
  const [locale, setLocale] = useState(initLocale ?? 'pt');

  moment.locale(locale === 'pt' ? 'pt-br' : locale);

  const changeLanguage = (newLocale: string): void => {
    setLocale(newLocale);
    moment.locale(newLocale);
    document.documentElement.lang = newLocale;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <IntlProvider
        locale={locale === 'pt' ? 'en' : locale}
        messages={messages[locale]}>
        <IntlToAxios />
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

const IntlToAxios = () => {
  const intl = useIntl();
  
  useEffect(() => {
    AxiosInstance.intl = intl;
  }, []);
  
  return null;
}

export const useLanguage = (): ILanguageContext => useContext(LanguageContext);
