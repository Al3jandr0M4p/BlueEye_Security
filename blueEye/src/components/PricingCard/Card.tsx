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
  return (
    <>
      <div className="bg-white p-4 rounded-xl border border-gray-800 flex flex-col h-full cursor-pointer transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl hover:z-20">
        <h3
          className="text-3xl font-semibold"
          style={{ fontFamily: "Google Sans" }}
        >
          {props.titleCard}
        </h3>
        <p className="text-black mt-2" style={{ fontFamily: "Google Sans" }}>
          {props.description}
        </p>

        <div
          className="text-5xl font-bold mt-6"
          style={{ fontFamily: "Google Sans" }}
        >
          ${props.pricingByMonth}{" "}
          <span
            className="text-sm font-normal text-black"
            style={{ fontFamily: "Google Sans" }}
          >
            /mes
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {props.checkList.map((check, id) => {
            return (
              <li className="flex gap-2 text-xs" key={id}>
                <Check className="text-green-400" size={16} />
                <span style={{ fontFamily: "Google Sans" }}>{check}</span>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => props.setOpenModal(true)}
          className="mt-8 w-full bg-black hover:bg-black/90 py-2 rounded-xl text-white cursor-pointer"
          style={{ fontFamily: "Google Sans" }}
        >
          Empezar
        </button>
      </div>
    </>
  );
};
