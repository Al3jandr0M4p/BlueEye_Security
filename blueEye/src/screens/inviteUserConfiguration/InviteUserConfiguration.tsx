import React from "react";
import Input from "../../components/Input/Input";
import { useInviteUserConfigurationHook } from "../../hooks/use-invite-user-configuration-hook";

const InviteUserConfiguration: React.FC = () => {
  const {
    firstName,
    lastName,
    isLoading,
    isDisabled,
    error,
    invitationToken,
    setFirstName,
    setLastName,
    handleSubmit,
  } = useInviteUserConfigurationHook();

  return (
    <section className="flex w-full min-h-screen bg-gray-50">
      <div className="flex flex-1 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md px-6 pt-8 pb-10">
          <div className="mb-6 space-y-1 text-center">
            <p className="text-sm uppercase tracking-wide text-gray-400">
              Invitacion segura
            </p>
            <h1 className="text-2xl font-semibold text-gray-800">
              Configura tu cuenta
            </h1>
            <p className="text-sm text-gray-500">
              Completa los campos para terminar de activar tu acceso.
            </p>
          </div>

          {invitationToken && (
            <p className="text-xs text-center text-gray-500 mb-4">
              Token detectado, tu invitacion se validara al enviar los datos.
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                text="first-name"
                value={firstName}
                onValueChange={setFirstName}
                translationKey="Nombre"
                variant="default"
              />
              <Input
                type="text"
                text="last-name"
                value={lastName}
                onValueChange={setLastName}
                translationKey="Apellido"
                variant="default"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isDisabled || isLoading}
              className={`w-full bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center gap-2 ${
                isDisabled || isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Confirmar cuenta"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default InviteUserConfiguration;
