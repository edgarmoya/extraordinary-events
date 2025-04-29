import React from "react";
import { LoginForm } from "../components/LoginForm";
import useLocalStorage from "use-local-storage";

const LoginPage = () => {
  const [theme] = useLocalStorage("theme", "light");

  return (
    <div
      className="container-fluid bg-body vh-100 d-flex justify-content-center align-items-center"
      data-bs-theme={theme}
    >
      <div className="m-5 col-11 col-sm-10 col-md-8 col-lg-7 col-xl-5 col-xxl-4 mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
