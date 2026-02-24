import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import { useRegisterBusinessHook } from "../../hooks/use-register-business";

const RegisterBusiness: React.FC = () => {
  const {
    password,
    email,
    userName,
    isLoading,
    rnc,
    rncError,
    isDisabled,
    handleSubmit,
    setPassword,
    setEmail,
    setUserName,
    setRnc,
  } = useRegisterBusinessHook();

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
                  <Link to="/register" className="text-gray-700 hover:text-primary-600">
                    Register
                  </Link>
                </li>
                <li>
                  <span className="mx-2 text-gray-400">{"/"}</span>
                </li>
                <li className="inline-flex items-center text-gray-500">
                  Register Business
                </li>
              </ol>
            </nav>

            <h1 className="text-xl pb-1.5 text-gray-600 md:text-2xl">
              BlueEye Security
            </h1>

            <div className="py-3 space-y-4">
              <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-xl">
                Registra tu Empresa, Institución o Equipo
              </h2>
            </div>

            <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit}>
              <Input
                type="email"
                text="email"
                value={email}
                onValueChange={setEmail}
                translationKey="Email"
              />

              <Input
                type="text"
                text="usuario"
                value={userName}
                onValueChange={setUserName}
                translationKey="Usuario"
              />

              <Input
                type="text"
                text="rnc"
                value={rnc}
                onValueChange={setRnc}
                translationKey="Rnc"
                error={rncError}
              />

              <Input
                type="password"
                text="password"
                value={password}
                onValueChange={setPassword}
                translationKey="Contraseña"
              />

              <button
                disabled={isDisabled || isLoading}
                type="submit"
                className={`w-full bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center gap-2 ${
                  isDisabled || isLoading
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  "Registrate"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterBusiness;
