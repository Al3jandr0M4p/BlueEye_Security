import type React from "react";
import { Link } from "react-router-dom";
import { useRegisterHook } from "../../hooks/use-register-hook";
import { FormComponent } from "../../components/FormComponent/FormComponent";
import { FormComponentFirst } from "../../components/FormComponent/FormComponentFirst";
import { ConnectionModal } from "../../modals/ConnectionModal/ConnectionModal";

const RegisterScreen: React.FC = () => {
  const {
    email,
    password,
    businessName,
    currency,
    username,
    country,
    taxId,
    phone,
    isLoading,
    isDisabledFirst,
    isDisabledSubmit,
    dialCode,
    taxIdError,
    currencyOptions,
    countryOptions,
    dialCodeOptions,
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
    setCountry,
    setCurrency,
    setUsername,
    setTaxId,
    setDialCode,
    handleSubmit,
    handlePhoneChange,
  } = useRegisterHook();

  return (
    <>
      <section className="flex flex-col w-full min-h-screen">
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-lg">
            <nav
              className="text-gray-600 text-sm mb-10"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1">
                <li className="inline-flex items-center text-lg">
                  <Link to="/" className="text-gray-700 hover:text-primary-600">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2 text-gray-400">{"/"}</span>
                </li>
                <li className="inline-flex items-center text-gray-500">
                  Register
                </li>
              </ol>
            </nav>

            <h1 className="text-xl pb-1.5 text-gray-600 md:text-2xl">
              BlueEye Security
            </h1>

            <div className="py-3 space-y-4">
              <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl">
                Registra tu Empresa
              </h2>
            </div>

            {showOfflineModal && (
              <ConnectionModal setShowOfflineModal={setShowOfflineModal} />
            )}

            {step === 1 && (
              <FormComponentFirst
                email={email}
                password={password}
                username={username}
                businessName={businessName}
                currencyOptions={currencyOptions}
                dialCodeOptions={dialCodeOptions}
                countryOptions={countryOptions}
                phone={phone}
                taxId={taxId}
                isDisabledFirst={isDisabledFirst}
                currency={currency}
                country={country}
                dialCode={dialCode}
                taxIdError={taxIdError}
                isOnline={isOnline}
                setStep={setStep}
                setEmail={setEmail}
                setPassword={setPassword}
                setBusinessName={setBusinessName}
                setCountry={setCountry}
                setCurrency={setCurrency}
                setUsername={setUsername}
                setDialCode={setDialCode}
                setTaxId={setTaxId}
                handlePhoneChange={handlePhoneChange}
              />
            )}

            {step === 2 && (
              <FormComponent
                setStep={setStep}
                handleLogoChange={handleLogoChange}
                handleSubmit={handleSubmit}
                logoPreview={logoPreview}
                isLoading={isLoading}
                isDisabledSubmit={isDisabledSubmit}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterScreen;
