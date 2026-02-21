"use client";
import React, { createContext, useContext } from "react";
import { translations, TranslationKeys } from "./translations";

interface I18nContextType {
  t: TranslationKeys;
  isRTL: true;
  locale: "ar";
}

const I18nContext = createContext<I18nContextType>({
  t: translations.ar,
  isRTL: true,
  locale: "ar",
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value: I18nContextType = {
    t: translations.ar,
    isRTL: true,
    locale: "ar",
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
