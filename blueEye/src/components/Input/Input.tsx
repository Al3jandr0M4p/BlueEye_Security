import React from "react";
import type { InputProps } from "../../types/types";

const Input: React.FC<InputProps> = ({
  value,
  onValueChange,
  text,
  type,
  translationKey,
  error,
}) => {
  return (
    <div className="relative w-full">
      <input
        id={text}
        type={type}
        value={value}
        onChange={(e) => {
          let v = e.target.value;
          if (text === "rnc") v = v.replace(/\D/g, "");
          onValueChange(v);
        }}
        placeholder=""
        className={`peer w-full border rounded-lg px-2 py-2 outline-none text-gray-900 transition-all ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-indigo-600"
        }`}
        autoComplete={type === "password" ? "new-password" : "off"}
        required
      />

      {!value && (
        <label
          htmlFor={text}
          className={`absolute left-1 -top-1 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs ${
            error
              ? "text-red-500 peer-focus:text-red-600"
              : "text-black peer-focus:text-indigo-600"
          }`}
          style={{ fontSize: 13 }}
        >
          {translationKey}
        </label>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
