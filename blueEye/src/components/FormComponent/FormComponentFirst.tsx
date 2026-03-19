import React from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "react-select";
import type { FormComponentFirstProps } from "../../types/types";

export const FormComponentFirst: React.FC<FormComponentFirstProps> = ({
  email,
  password,
  username,
  businessName,
  currencyOptions,
  dialCodeOptions,
  countryOptions,
  phone,
  taxId,
  country,
  currency,
  dialCode,
  taxIdError,
  isDisabledFirst,
  isOnline,
  setStep,
  setEmail,
  setPassword,
  setBusinessName,
  setCountry,
  setCurrency,
  setUsername,
  setTaxId,
  setDialCode,
  handlePhoneChange,
}) => {
  return (
    <form className="space-y-2 md:space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="email"
          text="email"
          value={email}
          onValueChange={setEmail}
          translationKey={"email"}
          variant="default"
        />

        <Input
          type="password"
          text="password"
          value={password}
          onValueChange={setPassword}
          translationKey={"contraseña"}
          variant="default"
        />

        <Input
          type="text"
          text="usuario"
          value={username}
          onValueChange={setUsername}
          translationKey={"usuario"}
          variant="default"
        />

        <Input
          type="text"
          text="nombre empresa"
          value={businessName}
          onValueChange={setBusinessName}
          translationKey={"Nombre empresa"}
          variant="default"
        />
      </div>

      <div>
        <Select
          options={countryOptions}
          value={countryOptions.find((o) => o.value === country) || null}
          onChange={(option) => setCountry(option?.value || "")}
          placeholder="Selecciona un pais"
          className="mb-2"
          classNamePrefix="react-select"
        />
      </div>

      <div className="flex gap-2">
        <div className="w-32">
          <Select
            options={dialCodeOptions}
            value={dialCodeOptions.find((o) => o.value === dialCode) || null}
            onChange={(option) => setDialCode(option?.value || "")}
            placeholder="+--"
            classNamePrefix="react-select"
          />
        </div>

        <div className="flex-1">
          <Input
            type="tel"
            text="tel"
            value={phone.replace(dialCode, "")}
            onValueChange={handlePhoneChange}
            translationKey="Telefono"
            variant="default"
          />
        </div>
      </div>

      <Input
        type="text"
        text="rnc"
        value={taxId}
        onValueChange={setTaxId}
        translationKey="Rnc"
        error={taxIdError}
        variant="default"
      />

      <div>
        <Select
          options={currencyOptions}
          value={currencyOptions.find((o) => o.value === currency) || null}
          onChange={(option) => setCurrency(option?.value || "")}
          placeholder="Selecciona una moneda"
          classNamePrefix="react-select"
        />
      </div>

      <button
        disabled={isDisabledFirst || !isOnline}
        type="button"
        onClick={() => setStep(2)}
        className={`w-full bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center gap-2 ${
          isDisabledFirst ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        Continuar
      </button>

      <p
        className="text-sm text-center font-light text-gray-500"
        style={{ fontFamily: "Google Sans" }}
      >
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-medium text-gray-600 hover:underline">
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
};
