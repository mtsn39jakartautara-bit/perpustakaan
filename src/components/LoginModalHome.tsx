"use client";
import LoginModal from "./LoginModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const LoginModalHome = () => {
  const params = useSearchParams();
  const [isModalLogin, setIsModalLogin] = useState(false);

  const { data } = useSession();
  console.log(data);

  const redirect = params.get("callbackUrl");
  const decodedRedirect = redirect ? decodeURIComponent(redirect) : "/";
  console.log(redirect);
  console.log(decodedRedirect);
  const isLogin = params.get("isLogin");

  // kalau ada salah satu param -> buka modal
  useEffect(() => {
    if (redirect || isLogin === "true") {
      setIsModalLogin(true);
    }
  }, [redirect, isLogin]);
  return (
    <div>
      {" "}
      {/* Modal Login */}
      <LoginModal
        callbackUrl={decodedRedirect}
        isOpen={isModalLogin}
        onClose={() => setIsModalLogin(false)}
        onSwitchToRegister={() => {
          // contoh: nanti bisa ubah ke register modal
          console.log("Switch ke register");
        }}
      />
    </div>
  );
};
export default LoginModalHome;
