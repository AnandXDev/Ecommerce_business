"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getUserCountry } from "../utils/getCountry";
import { countryConfig } from "../utils/countryConfig";

type CountryCode = keyof typeof countryConfig;

interface CountryContextType {
  country: CountryCode;
  currency: string;
  changeCountry: (code: CountryCode) => void;
}

const CountryContext = createContext<CountryContextType | null>(null);

export const CountryProvider = ({ children }: any) => {
  const [country, setCountry] = useState<CountryCode>("IN");

  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem("country") as CountryCode;
      if (saved) {
        setCountry(saved);
      } else {
        const detected = await getUserCountry();
        setCountry(detected in countryConfig ? detected : "IN");
      }
    };
    init();
  }, []);

  const changeCountry = (code: CountryCode) => {
    setCountry(code);
    localStorage.setItem("country", code);
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        currency: countryConfig[country].currency,
        changeCountry,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used inside CountryProvider");
  return ctx;
};