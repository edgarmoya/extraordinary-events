import React from "react";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="m-4 col-lg-6 col-md-12 mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
