import { createContext, useContext, useMemo } from "react";
import { fallbackLanguage, translations } from "./translations";

const dictionary = translations[fallbackLanguage];

const LanguageContext = createContext({
  language: fallbackLanguage,
  direction: dictionary.direction || "ltr",
  setLanguage: () => {},
  t: (key) => key,
});

const resolvePath = (source, path) => {
  if (!path) return "";
  return path.split(".").reduce((accumulator, segment) => {
    if (accumulator && typeof accumulator === "object" && segment in accumulator) {
      return accumulator[segment];
    }
    return undefined;
  }, source);
};

export const LanguageProvider = ({ children }) => {
  const contextValue = useMemo(() => {
    const translate = (key) => {
      const value = resolvePath(dictionary, key);
      return value !== undefined ? value : key;
    };

    return {
      language: fallbackLanguage,
      direction: dictionary.direction || "ltr",
      setLanguage: () => {},
      t: translate,
    };
  }, []);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};


