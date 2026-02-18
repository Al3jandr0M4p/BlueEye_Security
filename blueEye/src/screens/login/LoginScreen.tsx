import type React from "react";
import { Link } from "react-router-dom";
import { useLoginHook } from "../../hooks/use-login-hook";
import Input from "../../components/Input/Input";

const LoginScreen: React.FC = () => {
  const {
    identifier,
    password,
    t,
    isLoading,
    isDisabled,
    setIsLoading,
    setIdentier,
    setPassword,
    handleSubmit,
  } = useLoginHook();

  return (
    <section className="flex w-full h-screen">
      {/* mitad de la pantalla tendra algo relacionado con camaras */}
      <div className="w-1/2 bg-blue-600 hidden md:flex" />

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg">
          <h1 className="text-xl pb-1.5 text-gray-600 md:text-2xl">
            {t("businessName")}
          </h1>
          <div className="py-3 space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl">
              {t("signInYourAccount")}
            </h2>
          </div>

          <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit}>
            <Input
              type="text"
              text="identifier"
              value={identifier}
              onValueChange={setIdentier}
              translationKey={t("emailOrUsername")}
            />

            <Input
              type="password"
              text="password"
              value={password}
              onValueChange={setPassword}
              translationKey={t("password")}
            />

            <div className="flex gap-4 items-center">
              <span className="flex-1 border-t border-gray-300"></span>
              <span className="text-sm text-gray-700 whitespace-nowrap">{t("OrContinueWithSocial")}</span>
              <span className="flex-1 border-t border-gray-300"></span>              
            </div>

            <div className="flex justify-center">
              <Link
                to="#"
                className="text-sm font-medium text-primary-600 hover:underline"
              >
                {t("forgotYourPassword")}
              </Link>
            </div>

            <button
              disabled={isDisabled}
              onClick={() => setIsLoading(!isLoading)}
              type="submit"
              className={
                isDisabled
                  ? "w-full text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-no-drop"
                  : "w-full text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
              }
            >
              {isLoading ? <h1>cargando...</h1> : t("signIn")}
            </button>

            <p className="text-sm text-center font-light text-gray-500">
              {t("dontHaveAnAccount")}{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:underline"
              >
                {t("signUp")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginScreen;
