import type React from "react";
import { Link } from "react-router-dom";
import { useLoginHook } from "../../hooks/use-login-hook";
import Input from "../../components/Input/Input";
import { GoogleBtn } from "../../components/ButtonOAuth/ButtonOAuth";

const LoginScreen: React.FC = () => {
  const {
    identifier,
    password,
    loading,
    error,
    isDisabled,
    setIdentifier,
    setPassword,
    handleSubmit,
  } = useLoginHook();

  return (
    <section className="flex w-full h-screen">
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg">
          <nav className="text-gray-600 text-sm mb-10" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center text-lg">
                <Link to="/" className="text-gray-700 hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2 text-gray-400">{"/"}</span>
              </li>
              <li className="inline-flex items-center text-gray-500">Login</li>
            </ol>
          </nav>
          <h1 className="text-xl pb-1.5 text-gray-600 md:text-2xl">
            BlueEye Security
          </h1>
          <div className="py-3 space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl">
              Inicia Sesion en tu cuenta
            </h2>
          </div>

          <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit}>
            <Input
              type="text"
              text="identifier"
              value={identifier}
              onValueChange={setIdentifier}
              translationKey={"email o usuario"}
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

            <div className="flex gap-4 items-center">
              <span className="flex-1 border-t border-gray-300"></span>
              <span className="text-sm text-gray-700 whitespace-nowrap">O</span>
              <span className="flex-1 border-t border-gray-300"></span>
            </div>
            <GoogleBtn />

            <div className="flex justify-center">
              <Link
                to="/forgot-your-password"
                className="text-sm font-medium text-primary-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              disabled={isDisabled || loading}
              type="submit"
              className={`w-full bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center gap-2 ${
                isDisabled || loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <p className="text-sm text-center font-light text-gray-500">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:underline"
              >
                Registrarse
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginScreen;
