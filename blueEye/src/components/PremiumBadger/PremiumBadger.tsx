import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ─── BlueEye brand tokens ──────────────────────────────────────────────────────
const T = {
  green:     "#4CAF82",
  greenDark: "#2E8B5E",
  greenSft:  "#EAF7F1",
  greenMid:  "#A8DBBE",
  navy:      "#1A2332",
  sans:      "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
};

interface PremiumBadgerProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PremiumBadger: React.FC<PremiumBadgerProps> = ({
  setIsVisible,
}) => {
  return (
    <div
      style={{
        width: "100%",
        background: T.greenSft,
        borderBottom: `1px solid ${T.greenMid}`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 20px",
        gap: 40,
        flexWrap: "wrap",
        fontFamily: T.sans,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faHeart}
          style={{ fontSize: 16, color: T.green }}
        />
        <span
          style={{
            color: T.navy,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Vuélvete premium.
        </span>
        <a
          href="#"
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: T.greenDark,
            textDecoration: "underline",
          }}
        >
          Aquí
        </a>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: T.greenDark,
          padding: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon icon={faTimes} style={{ fontSize: 16 }} />
      </button>
    </div>
  );
};