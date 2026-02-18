import type React from "react";
import { Link } from "react-router-dom";
import { useRegisterHook } from "../../hooks/use-register-hook";
import Input from "../../components/Input/Input";

const RegisterScreen: React.FC = () => {
  const {
    userName,
    email,
    password,
    t,
    isDisabled,
    isLoading,
    setIsLoading,
    handleSubmit,
    setEmail,
    setPassword,
    setUserName,
  } = useRegisterHook();

  return (
    <section className="flex w-full h-screen">
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg">
          <h1 className="text-xl pb-1.5 text-gray-600 md:text-2xl">
            {t("businessName")}
          </h1>
          <div className="py-3 space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl">
              {t("signUpYourAccount")}
            </h2>
          </div>

          <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit}>
            <Input
              type="email"
              text="email"
              value={email}
              onValueChange={setEmail}
              translationKey={t("email")}
            />

            <Input
              type="text"
              text="usuario"
              value={userName}
              onValueChange={setUserName}
              translationKey={t("name")}
            />

            <Input
              type="password"
              text="password"
              value={password}
              onValueChange={setPassword}
              translationKey={t("password")}
            />

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
              {isLoading ? <h1>cargando...</h1> : t("signUp")}
            </button>

            <p className="text-sm text-center font-light text-gray-500">
              {t("doHaveAnAccount")}{" "}
              <Link
                to="/"
                className="font-medium text-primary-600 hover:underline"
              >
                {t("signIn")}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* mitad de la pantalla tendra algo relacionado con camaras */}
      <div className="w-1/2 bg-blue-600 hidden md:flex" />
    </section>
  );
};

export default RegisterScreen;
