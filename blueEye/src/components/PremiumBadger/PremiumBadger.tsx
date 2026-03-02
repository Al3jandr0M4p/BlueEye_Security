import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PremiumBadgerProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PremiumBadger: React.FC<PremiumBadgerProps> = ({
  setIsVisible,
}) => {
  return (
    <>
      <div className="w-full bg-slate-50 flex sm:flex-row items-center justify-center px-4 sm:px-10 md:px-20 py-3 text-sm flex-wrap gap-10">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <FontAwesomeIcon icon={faHeart} className="text-xl text-slate-800" />
          <span className="text-slate-800 font-medium text-base sm:text-lg">
            Vuelvete premiun.
          </span>
          <a
            href="#"
            className="underline font-medium text-base sm:text-lg text-slate-700 hover:text-slate-900"
          >
            Aqui
          </a>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="mt-2 sm:mt-0 text-slate-500 hover:text-slate-700"
        >
          <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-lg" />
        </button>
      </div>
    </>
  );
};
