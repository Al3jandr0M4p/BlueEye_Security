import { Check } from "lucide-react";
import type React from "react";

interface PricingCardProps {
  titleCard: string;
  description: string;
  pricingByMonth: number;
  checkList: string[];
  setOpenModal: (key: boolean) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ ...props }) => {
  const isProPlan = props.titleCard.toLowerCase() === "pro";

  return (
    <div
      className={`group relative flex h-full min-h-130 w-full flex-col overflow-hidden rounded-2xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isProPlan
          ? "border-emerald-500 ring-1 ring-emerald-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white via-white to-emerald-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {isProPlan && (
          <span
            className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
            style={{ fontFamily: "Google Sans" }}
          >
            Mas popular
          </span>
        )}

        <h3
          className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl"
          style={{ fontFamily: "Google Sans" }}
        >
          {props.titleCard}
        </h3>

        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600" style={{ fontFamily: "Google Sans" }}>
          {props.description}
        </p>

        <div className="mt-6 flex items-end gap-1" style={{ fontFamily: "Google Sans" }}>
          <span className="text-5xl font-bold text-gray-950 md:text-6xl">${props.pricingByMonth}</span>
          <span
            className="mb-1 text-sm font-medium text-gray-500"
            style={{ fontFamily: "Google Sans" }}
          >
            /mes
          </span>
        </div>

        <ul className="mt-7 flex-1 space-y-3">
          {props.checkList.map((check, id) => {
            return (
              <li className="flex items-start gap-3 text-sm text-gray-700" key={id}>
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="text-emerald-600" size={13} />
                </span>
                <span className="leading-5" style={{ fontFamily: "Google Sans" }}>
                  {check}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => props.setOpenModal(true)}
          className={`mt-8 w-full cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${
            isProPlan
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
          style={{ fontFamily: "Google Sans" }}
        >
          Empezar
        </button>
      </div>
    </div>
  );
};
