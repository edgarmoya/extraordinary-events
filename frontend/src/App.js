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

            <Route path={Paths.EVENTS} element={<EventsPage />}>
              {/* Rutas secundarias de EVENTS */}
              <Route path={Paths.OPEN_EVENTS} element={<EventsPage />} />
              <Route path={Paths.CLOSE_EVENTS} element={<EventsPage />} />
            </Route>

            <Route path={Paths.SECTORS} element={<SectorsPage />}>
              {/* Rutas secundarias de SECTORS */}
              <Route path={Paths.ACTIVE_SECTORS} element={<SectorsPage />} />
              <Route path={Paths.INACTIVE_SECTORS} element={<SectorsPage />} />
            </Route>

            <Route path={Paths.ENTITIES} element={<EntitiesPage />}>
              {/* Rutas secundarias de ENTITIES */}
              <Route path={Paths.ACTIVE_ENTITIES} element={<EntitiesPage />} />
              <Route
                path={Paths.INACTIVE_ENTITIES}
                element={<EntitiesPage />}
              />
            </Route>

            <Route path={Paths.TYPES} element={<TypesPage />}>
              {/* Rutas secundarias de TYPES */}
              <Route path={Paths.ACTIVE_TYPES} element={<TypesPage />} />
              <Route path={Paths.INACTIVE_TYPES} element={<TypesPage />} />
            </Route>

            <Route
              path={Paths.CLASSIFICATIONS}
              element={<ClassificationsPage />}
            >
              {/* Rutas secundarias de CLASSIFICATIONS */}
              <Route
                path={Paths.ACTIVE_CLASSIFICATIONS}
                element={<ClassificationsPage />}
              />
              <Route
                path={Paths.INACTIVE_CLASSIFICATIONS}
                element={<ClassificationsPage />}
              />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
