import React from "react";
import LoginForm from "../components/LoginForm";
import useLocalStorage from "use-local-storage";
import Copyright from "../../../ui/Copyright";

const LoginPage = () => {
  const [theme] = useLocalStorage("theme", "light");

  return (
    <div
      className="container-fluid d-flex flex-column bg-body"
      style={{ height: "100dvh" }}
      data-bs-theme={theme}
    >
      <div className="flex-grow-1 align-content-center col-11 col-sm-9 col-md-7 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
        <LoginForm />
      </div>
      <Copyright topHr={false} className="py-2" />
    </div>
  );
};

export default LoginPage;
