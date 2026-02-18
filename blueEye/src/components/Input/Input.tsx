import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>
  text: string;
  type: string;
  translationKey: string;
}

const Input: React.FC<InputProps> = ({ value, onValueChange, text, type, translationKey }) => {
  return (
    <div className="relative w-full">
      <input
        id={text}
        type={type}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder=""
        className="peer w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 text-gray-900 focus:border-indigo-600 focus:ring-0 transition-all"
        autoComplete="off"
        required
      />

      <label
        htmlFor={text}
        className="absolute left-3 -top-2 bg-white px-1 text-sm transition-all text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-600"
      >
        {translationKey}
      </label>
    </div>
  );
};

export default Input;
