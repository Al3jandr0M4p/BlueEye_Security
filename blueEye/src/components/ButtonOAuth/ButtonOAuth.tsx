import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginHook } from "../../hooks/use-google-login-hook";

export function GoogleBtn() {
  const { handleSubmit } = useGoogleLoginHook();

  return (
    <GoogleLogin
      onSuccess={handleSubmit}
      onError={() => console.log("Something went wrong with sign in")}
    />
  );
}
