import { GoogleLogin } from "@react-oauth/google";

export function GoogleBtn() {
  return (
    <GoogleLogin
      onSuccess={(res) => console.log(res)}
      onError={() => console.log("Something went wrong with sign in")}
    />
  );
}
