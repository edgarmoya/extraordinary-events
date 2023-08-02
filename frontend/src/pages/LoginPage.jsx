import React from "react";
import { LoginForm } from "../components/LoginForm";
import useLocalStorage from "use-local-storage";

const LoginPage = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <div className="container-fluid bg-body vh-100" data-bs-theme={theme}>
      <div className="row">
        <div className="m-5 col-lg-5 col-md-8 col-sm-10 mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
