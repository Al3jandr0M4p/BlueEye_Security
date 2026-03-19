import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import ComingSoon from "../../assets/coming_soon.svg";
import ReactDOM from "react-dom";
import type { ComingSoonModalProps } from "../../types/types";

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  setOpenModal,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpenModal]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 animate-fadeIn"
        onClick={() => setOpenModal(false)}
      />

      <div className="relative bg-white w-full max-w-xl mx-4 rounded-2xl shadow-2xl p-8 transform scale-95 opacity-0 animate-modalIn">
        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full transition cursor-pointer"
          onClick={() => setOpenModal(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="text-2xl font-bold text-center">Coming Soon</h3>

        <p className="text-gray-600 text-lg text-center mt-3">
          Esta funcionalidad estará disponible pronto.
        </p>

        <img
          src={ComingSoon}
          alt="Coming soon"
          className="w-full max-w-sm mx-auto pt-10"
        />
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};
