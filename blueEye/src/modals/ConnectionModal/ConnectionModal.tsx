import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ConnectionModalProps {
  setShowOfflineModal: (v: boolean) => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  setShowOfflineModal,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowOfflineModal(false)}
    >
      <div
        className="bg-white rounded-lg p-6 w-[90%] max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowOfflineModal(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="text-lg font-semibold mb-2">Sin conexión</h3>

        <p className="text-sm text-gray-600">
          Conéctate a internet para continuar con el registro.
        </p>
      </div>
    </div>
  );
};
