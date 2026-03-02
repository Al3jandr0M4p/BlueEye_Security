import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserService } from "../service/auth.service";
import type { CountryOption, RestCountry } from "../types/types";

export function useRegisterHook() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState<string>("");
  const [taxId, setTaxId] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [logo, setLogo] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState<string>("");
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [availableDialCodes, setAvailableDialCodes] = useState<string[]>([]);

  const isDisabledFirst =
    !email ||
    !password ||
    !username ||
    !businessName ||
    !country ||
    !currency ||
    !taxId ||
    !phone;

  const isDisabledSubmit =
    !email ||
    !password ||
    !username ||
    !businessName ||
    !country ||
    !currency ||
    !taxId ||
    !phone ||
    !logo;

  const isValidTaxId = (taxId: string) => /^\d{9}$|^\d{11}$/.test(taxId);
  const taxIdError = useMemo(() => {
    if (!taxId) return "";
    if (!isValidTaxId(taxId)) return "RNC invalido (9 o 11 dígitos)";
    return "";
  }, [taxId]);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd,currencies",
        );

        const data: RestCountry[] = await res.json();

        const currencySet = new Set<string>();

        const formatted: CountryOption[] = data
          .map((c) => {
            const root = c.idd?.root ?? "";
            const suffixes = c.idd?.suffixes ?? [];

            const dialCodes: string[] =
              root && suffixes.length > 0
                ? suffixes.map((s) => `${root}${s}`)
                : [];

            const currencyCodes: string[] = c.currencies
              ? Object.keys(c.currencies)
              : [];

            currencyCodes.forEach((code) => currencySet.add(code));

            return {
              name: c.name.common,
              code: c.cca2,
              dialCodes,
              currencies: currencyCodes,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
        setCurrencies(Array.from(currencySet).sort());
      } catch (err) {
        console.error("Error loading countries", err);
      }
    }

    loadCountries();
  }, []);

  useEffect(() => {
    const selected = countries.find((c) => c.code === country);

    if (selected) {
      setAvailableDialCodes(selected.dialCodes);

      const first = selected.dialCodes[0] ?? "";
      setDialCode(first);
      setPhone("");
    }
  }, [country, countries]);

  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(logo);
    setLogoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [logo]);

  const countryOptions = countries.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const currencyOptions = currencies.map((cur) => ({
    value: cur,
    label: cur,
  }));

  const dialCodeOptions = availableDialCodes.map((code) => ({
    value: code,
    label: code,
  }));

  const handlePhoneChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) return;
    setLogo(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const fullPhone = dialCode + phone;

    if (!logo) return;

    try {
      const result = await registerUserService({
        email,
        password,
        username,
        businessName,
        country,
        currency,
        taxId,
        phone: fullPhone,
        logo,
      });

      console.log(`Result ${result.data}`);

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    businessName,
    currency,
    currencies,
    username,
    taxId,
    country,
    countries,
    phone,
    isLoading,
    isDisabledFirst,
    isDisabledSubmit,
    dialCode,
    availableDialCodes,
    taxIdError,
    countryOptions,
    currencyOptions,
    dialCodeOptions,
    logo,
    logoPreview,
    step,
    setStep,
    handleLogoChange,
    setEmail,
    setPassword,
    setBusinessName,
    setCurrency,
    setUsername,
    setCountry,
    setTaxId,
    setDialCode,
    handleSubmit,
    handlePhoneChange,
  };
}
