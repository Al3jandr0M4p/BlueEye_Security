import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resendEmailOtpService, verifyEmailOtpService } from "../../service/service";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmail: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const initialEmail = query.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || code.trim().length !== 6) {
      setError("Ingresa tu correo y el cÃ³digo de 6 dÃ­gitos.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtpService({ email, code: code.trim() });
      setMessage("Correo verificado. Ya puedes iniciar sesiÃ³n.");
      window.setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setError("No se pudo verificar el cÃ³digo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Ingresa tu correo.");
      return;
    }

    setLoading(true);
    try {
      await resendEmailOtpService(email);
      setMessage("Te enviamos un nuevo cÃ³digo.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError("No se pudo reenviar el cÃ³digo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex w-full min-h-screen">
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg p-6">
          <nav className="text-gray-600 text-sm mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center text-lg">
                <Link to="/" className="text-gray-700 hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2 text-gray-400">{"/"}</span>
              </li>
              <li className="inline-flex items-center text-gray-500">
                Verificar correo
              </li>
            </ol>
          </nav>

          <h1 className="text-xl pb-1.5 text-gray-600 md:text-2xl">
            BlueEye Security
          </h1>
          <div className="py-3 space-y-2">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl">
              Verifica tu correo
            </h2>
            <p className="text-sm text-gray-600">
              Te enviamos un cÃ³digo de 6 dÃ­gitos a tu email.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleVerify}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="tu@correo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                CÃ³digo
              </label>
              <input
                value={code}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(v);
                }}
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg tracking-[0.45em]"
                placeholder="______"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center gap-2 ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>

            <button
              type="button"
              disabled={loading || cooldown > 0}
              onClick={handleResend}
              className={`w-full rounded-lg border px-5 py-2.5 text-sm font-medium ${
                cooldown > 0
                  ? "cursor-not-allowed border-gray-200 text-gray-400"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar cÃ³digo"}
            </button>

            {message && <p className="text-emerald-600 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <p className="text-sm text-center font-light text-gray-500">
              Â¿Ya verificaste?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:underline">
                Iniciar sesiÃ³n
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;

