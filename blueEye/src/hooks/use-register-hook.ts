import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserService } from "../service/service";
import type { CountryOption, RestCountry } from "../types/types";

export function useRegisterHook() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState("");
  const [username, setUsername] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [businessName, setBusinessName] = useState("");

  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [hasShownOffline, setHasShownOffline] = useState(false);

  const [currencies, setCurrencies] = useState<string[]>([]);
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

  const isDisabledSubmit = isDisabledFirst || !logo || !isOnline;

  const isValidTaxId = (taxId: string) => /^\d{9}$|^\d{11}$/.test(taxId);

  const taxIdError = useMemo(() => {
    if (!taxId) return "";
    if (!isValidTaxId(taxId)) return "RNC invalido (9 o 11 dígitos)";
    return "";
  }, [taxId]);

  useEffect(() => {
    const checkRealConnection = async () => {
      try {
        await fetch("http://localhost:3000/api/", { cache: "no-store" });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    const handleOnline = () => {
      checkRealConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkRealConnection();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline && !hasShownOffline) {
      setShowOfflineModal(true);
      setHasShownOffline(true);
    }

    if (isOnline) {
      setHasShownOffline(false);
    }
  }, [isOnline, hasShownOffline]);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd,currencies",
        );

        const data: RestCountry[] = await res.json();

        localStorage.setItem("countries_cache", JSON.stringify(data));
        processData(data);
      } catch (err) {
        const cached = localStorage.getItem("countries_cache");

        if (cached) {
          const data: RestCountry[] = JSON.parse(cached);
          processData(data);
        } else {
          console.error("No hay datos disponibles");
        }

        console.error(err);
      }
    }

    function processData(data: RestCountry[]) {
      const currencySet = new Set<string>();

      const formatted: CountryOption[] = data
        .map((c) => {
          const root = c.idd?.root ?? "";
          const suffixes = c.idd?.suffixes ?? [];

          const dialCodes =
            root && suffixes.length > 0
              ? suffixes.map((s) => `${root}${s}`)
              : [];

          const currencyCodes = c.currencies ? Object.keys(c.currencies) : [];

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
    }

    loadCountries();
  }, []);

  useEffect(() => {
    const selected = countries.find((c) => c.code === country);

    if (selected) {
      setAvailableDialCodes(selected.dialCodes);
      setDialCode(selected.dialCodes[0] ?? "");
      setPhone("");
    }
  }, [country, countries]);

  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }

    const url = URL.createObjectURL(logo);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [logo]);

  const countryOptions = countries.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const currencyOptions = currencies.map((c) => ({
    value: c,
    label: c,
  }));

  const dialCodeOptions = availableDialCodes.map((c) => ({
    value: c,
    label: c,
  }));

  const handlePhoneChange = (value: string) => {
    if (/^\d*$/.test(value)) setPhone(value);
  };

  const handleLogoChange = (file: File | null) => {
    if (file) setLogo(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOnline || !logo) return;

    setIsLoading(true);

    try {
      const result = await registerUserService({
        email,
        password,
        username,
        businessName,
        country,
        currency,
        taxId,
        phone: dialCode + phone,
        logo,
      });

      console.log(result);
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
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
    isOnline,
    showOfflineModal,
    setShowOfflineModal,
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
