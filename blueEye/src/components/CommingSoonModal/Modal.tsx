import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import ComingSoon from "../../assets/coming_soon.svg";

interface ComingSoonModalProps {
  setOpenModal: (v: boolean) => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  setOpenModal,
}) => {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenModal(false);
    };
    window.addEventListener("keydown", esc as EventListener);
    return () => window.removeEventListener("keydown", esc as EventListener);
  }, [setOpenModal]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative bg-white w-full max-w-xl rounded-xl shadow-xl p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full transition cursor-pointer"
          onClick={() => setOpenModal(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="text-xl font-bold text-center">Coming Soon</h3>
        <p className="text-gray-700 text-lg text-center">
          Esta funcionalidad estará disponible pronto.
        </p>

        <img src={ComingSoon} alt="coming soon image" className="w-xl pt-10" />
      </div>
    </div>
  );
};
