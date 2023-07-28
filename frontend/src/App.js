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
import HomePage from "./pages/HomePage";
import EntitiesPage from "./pages/EntitiesPage";
import TypesPage from "./pages/TypesPage";
import SectorsPage from "./pages/SectorsPage";
import ClassificationsPage from "./pages/ClassificationsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={Paths.EMPTY} element={<Navigate to={Paths.HOME} />} />
          <Route path={Paths.ADMIN} element={<AdminPage />} />
          <Route path={Paths.LOGIN} element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path={Paths.HOME} element={<HomePage />} />
            <Route path={Paths.EVENTS} element={<EventsPage />} />
            <Route path={Paths.TYPES} element={<TypesPage />} />
            <Route path={Paths.ENTITIES} element={<EntitiesPage />} />
            <Route path={Paths.SECTORS} element={<SectorsPage />} />
            <Route
              path={Paths.CLASSIFICATIONS}
              element={<ClassificationsPage />}
            />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
