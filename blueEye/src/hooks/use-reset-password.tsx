import { useEffect, useState } from "react";
import { resetPasswordService } from "../service/services";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDisabled = !newPassword || !accessToken || !refreshToken;

  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const param = new URLSearchParams(hash.substring(1));
    const accessToken = param.get("access_token");
    const refreshToken = param.get("refresh_token");

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken || !refreshToken) {
      console.log("No access token or refresh token found in URL");
      return;
    }

    setIsLoading(true);

    try {
      const data = await resetPasswordService({
        newPassword,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      sileo.success({
        title: "Contraseña restablecida",
        description: "Tu contraseña ha sido restablecida exitosamente",
      });

      console.log("Informacion recibida:", data);

      setTimeout(() => {
        navigate("/login");
      }, 300);
    } catch (err) {
      console.log("Error al enviar el codigo de recuperacion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newPassword,
    isDisabled,
    isLoading,
    setNewPassword,
    handleSubmit,
  };
}
