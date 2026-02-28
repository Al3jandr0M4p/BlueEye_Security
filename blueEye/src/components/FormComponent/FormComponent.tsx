import React from "react";
import type { FormComponentProps } from "../../types/types";

export const FormComponent: React.FC<FormComponentProps> = ({
  logoPreview,
  isLoading,
  isDisabledSubmit,
  handleSubmit,
  handleLogoChange,
  setStep,
}) => {
  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium">Sube el logo de tu empresa</h3>

      <input
        type="file"
        name="logo"
        id="logo"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0] || null;
          handleLogoChange(file);
        }}
        className="block w-full text-sm cursor-pointer"
      />

      {logoPreview && (
        <div className="mt-2 flex justify-center">
          <img
            src={logoPreview}
            alt="Logo preview"
            className="w-full h-68 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 border rounded-lg py-2 px-2 justify-center items-center gap-2 cursor-pointer"
          style={{ fontFamily: "Google Sans" }}
        >
          Volver
        </button>

        <button
          type="submit"
          style={{ fontFamily: "Google Sans" }}
          disabled={isDisabledSubmit || isLoading}
          className={`flex items-center justify-center bg-black text-white font-medium rounded-lg text-sm px-12 py-2 flex-1 ${
            isDisabledSubmit || isLoading
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Registrarse"
          )}
        </button>
      </div>
    </form>
  );
};
