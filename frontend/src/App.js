import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import EventsPage from "./pages/EventsPage";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Paths from "./routes/Paths";
import PrivateRoute from "./routes/PrivateRoute";
import BasePage from "./pages/BasePage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={Paths.EMPTY} element={<Navigate to={Paths.HOME} />} />
          <Route path={Paths.ADMIN} element={<AdminPage />} />
          <Route path={Paths.LOGIN} element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<BasePage />}>
              <Route path={Paths.HOME} element={<HomePage />} />
            </Route>
            <Route element={<BasePage />}>
              <Route path={Paths.EVENTS} element={<EventsPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
