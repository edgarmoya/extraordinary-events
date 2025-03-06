import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { VectorMap } from "@south-paw/react-vector-maps";
import styled from "styled-components";
import DashboardService from "../api/dashboard.api";
import PieChart from "../utils/charts/PieChart";
import StackedBarChart from "../utils/charts/StackedBarChart";
import HorizontalBarChart from "../utils/charts/HorizontalBarChart";
import SmallDashboardLoader from "../components/skeletons/SmallDashboardLoader";
import LargeDashboardLoader from "../components/skeletons/LargeDashboardLoader";
import Paths from "../routes/Paths";

const Map = styled.div`
  margin: 3rem auto;
  width: 400px;

  svg {
    stroke: #fff;

    // All layers are just path elements
    path {
      fill: #0d6efd;
      cursor: pointer;
      outline: none;

      // When a layer is hovered
      &:hover {
        fill: #094cb0;
      }

      // When a layer is focused.
      &:focus {
        fill: #052a63;
      }
    }
  }
`;

function HomePage() {
  const [clicked, setClicked] = useState("Ninguna");
  const [error, setError] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [totalEventsCount, setTotalEventsCount] = useState(null);
  const [closedEventsCount, setClosedEventsCount] = useState(null);
  const [openEventsCount, setOpenEventsCount] = useState(null);
  const [overdueEventsCount, setOverdueEventsCount] = useState(null);
  const [percentageClosed, setPercentageClosed] = useState(null);
  const [percentageOpen, setPercentageOpen] = useState(null);
  const [percentageOverdue, setPercentageOverdue] = useState(null);

  const [eventsByProvince, setEventsByProvince] = useState(0);
  const [measuresByProvince, setMeasuresByProvince] = useState(0);
  const [percentageBySector, setPercentageBySector] = useState([]);
  const [scopesByProvince, setScopesByProvince] = useState([]);
  const [eventsByType, setEventsByType] = useState([]);

  const layerProps = {
    onClick: ({ target }) => {
      setClicked(target.attributes.name.value);
      loadEventsByProvince(target.attributes.id.value);
    },
  };

  useEffect(() => {
    // Cargar el archivo JSON desde la carpeta public
    fetch("/cuba.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el archivo JSON");
        }
        return response.json();
      })
      .then((data) => setMapData(data))
      .catch((error) => console.error(error));
  }, []);

  //* Función para cargar resumen por provincia
  const loadEventsByProvince = useCallback(async (provinceId) => {
    try {
      const response = await DashboardService.getEventsCountByProvince(
        provinceId
      );
      setEventsByProvince(response.data.events_count);
      setMeasuresByProvince(response.data.measures_count);
    } catch (error) {
      console.error("Error obteniendo resumen: ", error);
    }
  }, []);

  // Función para cargar todos los datos
  const loadAllData = useCallback(async () => {
    try {
      // Ejecutar todas las llamadas en paralelo
      const [overviewResponse, sectorResponse, scopesResponse, typesResponse] =
        await Promise.all([
          DashboardService.getEventsCount(),
          DashboardService.getPercentageBySector(),
          DashboardService.getEventsCountScope(),
          DashboardService.getEventsCountByType(),
        ]);

      // Procesar la respuesta de cada llamada
      setTotalEventsCount(overviewResponse.data.total_events_count);
      setClosedEventsCount(overviewResponse.data.closed_events_count);
      setOpenEventsCount(overviewResponse.data.open_events_count);
      setOverdueEventsCount(overviewResponse.data.overdue_events_count);
      setPercentageClosed(overviewResponse.data.percentage_closed);
      setPercentageOpen(overviewResponse.data.percentage_open);
      setPercentageOverdue(overviewResponse.data.percentage_overdue);

      setPercentageBySector(sectorResponse.data.results);
      setScopesByProvince(scopesResponse.data.results);
      setEventsByType(typesResponse.data.results);
    } catch (error) {
      //console.error("Error obteniendo información: ", error);
      setError(true);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <Layout pageTitle="Resumen">
      <div
        className="container-fluid overflow-y-auto h-100"
        style={{ maxHeight: "calc(100vh - 60px)" }}
      >
        {error ? (
          <div className="d-flex w-100 h-100 justify-content-center align-items-center">
            <div className="alert alert-info px-4 text-center">
              <div className="d-flex flex-row gap-3 justify-content-center align-items-center">
                <svg
                  className="me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height={"2rem"}
                >
                  <path d="M23.813,11.511l-1.643-7.23c-.573-2.521-2.779-4.281-5.364-4.281H7.193C4.608,0,2.402,1.76,1.83,4.281L.187,11.51c-.124,.543-.187,1.103-.187,1.664v5.327c0,3.033,2.467,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5v-5.327c0-.561-.062-1.12-.187-1.662ZM16.807,3c.431,0,.837,.11,1.193,.303v1.697H6v-1.697c.356-.193,.762-.303,1.193-.303h9.614ZM5.578,8h12.844l.692,3H4.885l.692-3Zm15.422,10.5c0,1.378-1.121,2.5-2.5,2.5H5.5c-1.378,0-2.5-1.122-2.5-2.5v-4.5s0,0,.001,0c0,0,.002,0,.003,0H20.996s.002,0,.003,0c0,0,0,0,0,0v4.5Zm-6-1c0,.829-.672,1.5-1.5,1.5h-3c-.829,0-1.5-.671-1.5-1.5s.671-1.5,1.5-1.5h3c.828,0,1.5,.671,1.5,1.5Z" />
                </svg>
                <div className="text-center">
                  <p className="m-0">
                    Para visualizar el resumen debe antes ingresar datos al
                    sistema
                  </p>
                  <p className="m-0">
                    Puede comenzar{" "}
                    <Link
                      className="btn btn-link align-baseline text-decoration-underline text-info p-0"
                      to={Paths.EVENTS}
                    >
                      añadiendo
                    </Link>{" "}
                    nuevos hechos extraordinarios
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex flex-row flex-wrap align-content-stretch">
              {/* Cantidad de hechos */}
              <div className="col-lg-3 col-md-6 col-12 pt-2 px-1">
                <Suspense fallback={<SmallDashboardLoader />}>
                  {totalEventsCount !== null ? (
                    <div className="card shadow-sm h-100 w-100">
                      <div className="row g-0 p-2 h-100">
                        <div className="col-md-3 bg-primary p-1 rounded-2 d-flex justify-content-center align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            height={"1.5rem"}
                          >
                            <path d="m18.5,2h-.5v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-6v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-.5C2.468,2,0,4.467,0,7.5v11c0,3.033,2.468,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5V7.5c0-3.033-2.468-5.5-5.5-5.5Zm0,19H5.5c-1.379,0-2.5-1.122-2.5-2.5v-9.5h18v9.5c0,1.378-1.121,2.5-2.5,2.5Zm-8.5-8.5v2c0,.828-.672,1.5-1.5,1.5h-2c-.828,0-1.5-.672-1.5-1.5v-2c0-.828.672-1.5,1.5-1.5h2c.828,0,1.5.672,1.5,1.5Z" />
                          </svg>
                        </div>
                        <div className="col-md-9">
                          <div className="card-body p-2">
                            <h6 className="card-title">Total de hechos</h6>
                            <p className="card-text">{totalEventsCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SmallDashboardLoader />
                  )}
                </Suspense>
              </div>

              {/* Cantidad de hechos sin cerrar */}
              <div className="col-lg-3 col-md-6 col-12 pt-2 px-1">
                <Suspense fallback={<SmallDashboardLoader />}>
                  {openEventsCount !== null ? (
                    <div className="card shadow-sm h-100 w-100">
                      <div className="row g-0 p-2 h-100">
                        <div className="col-md-3 bg-primary p-1 rounded-2 d-flex justify-content-center align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            height={"1.5rem"}
                          >
                            <path d="m24,7v1H0v-1C0,4.243,2.243,2,5,2h1v-1c0-.552.448-1,1-1s1,.448,1,1v1h8v-1c0-.552.448-1,1-1s1,.448,1,1v1h1c2.757,0,5,2.243,5,5Zm0,3v9c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5v-9h24Zm-10.586,7l2.293-2.293c.391-.391.391-1.023,0-1.414s-1.023-.391-1.414,0l-2.293,2.293-2.293-2.293c-.391-.391-1.023-.391-1.414,0s-.391,1.023,0,1.414l2.293,2.293-2.293,2.293c-.391.391-.391,1.023,0,1.414.195.195.451.293.707.293s.512-.098.707-.293l2.293-2.293,2.293,2.293c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023,0-1.414l-2.293-2.293Z" />
                          </svg>
                        </div>
                        <div className="col-md-9">
                          <div className="card-body p-2">
                            <h6 className="card-title">
                              Total de hechos sin cerrar
                            </h6>
                            <p className="card-text">
                              {openEventsCount}
                              <small className="text-danger">
                                {" "}
                                ({percentageOpen}%){" "}
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SmallDashboardLoader />
                  )}
                </Suspense>
              </div>

              {/* Cantidad de hechos cerrados */}
              <div className="col-lg-3 col-md-6 col-12 pt-2 px-1">
                <Suspense fallback={<SmallDashboardLoader />}>
                  {closedEventsCount !== null ? (
                    <div className="card shadow-sm h-100 w-100">
                      <div className="row g-0 p-2 h-100">
                        <div className="col-md-3 bg-primary p-1 rounded-2 d-flex justify-content-center align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            height={"1.5rem"}
                          >
                            <path d="M0,8v-1C0,4.243,2.243,2,5,2h1V1c0-.552,.447-1,1-1s1,.448,1,1v1h8V1c0-.552,.447-1,1-1s1,.448,1,1v1h1c2.757,0,5,2.243,5,5v1H0Zm24,2v9c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V10H24Zm-6.168,3.152c-.384-.397-1.016-.409-1.414-.026l-4.754,4.582c-.376,.376-1.007,.404-1.439-.026l-2.278-2.117c-.403-.375-1.035-.354-1.413,.052-.376,.404-.353,1.037,.052,1.413l2.252,2.092c.566,.567,1.32,.879,2.121,.879s1.556-.312,2.108-.866l4.74-4.568c.397-.383,.409-1.017,.025-1.414Z" />
                          </svg>
                        </div>
                        <div className="col-md-9">
                          <div className="card-body p-2">
                            <h6 className="card-title">
                              Total de hechos cerrados
                            </h6>
                            <p className="card-text">
                              {closedEventsCount}
                              <small className="text-success">
                                {" "}
                                ({percentageClosed}%){" "}
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SmallDashboardLoader />
                  )}
                </Suspense>
              </div>

              {/* Cantidad de hechos con más de 30 días */}
              <div className="col-lg-3 col-md-6 col-12 pt-2 px-1">
                <Suspense fallback={<SmallDashboardLoader />}>
                  {overdueEventsCount !== null ? (
                    <div className="card shadow-sm h-100 w-100">
                      <div className="row g-0 p-2">
                        <div className="col-md-3 bg-primary p-1 rounded-2 d-flex justify-content-center align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            height={"1.5rem"}
                          >
                            <path d="M24,7v1H0v-1C0,4.239,2.239,2,5,2h1V1c0-.552,.448-1,1-1h0c.552,0,1,.448,1,1v1h8V1c0-.552,.448-1,1-1h0c.552,0,1,.448,1,1v1h1c2.761,0,5,2.239,5,5Zm0,10c0,3.86-3.141,7-7,7s-7-3.14-7-7,3.141-7,7-7,7,3.14,7,7Zm-5,.586l-1-1v-1.586c0-.552-.448-1-1-1h0c-.552,0-1,.448-1,1v2c0,.265,.105,.52,.293,.707l1.293,1.293c.39,.39,1.024,.39,1.414,0h0c.39-.39,.39-1.024,0-1.414Zm-11-.586c0-2.829,1.308-5.35,3.349-7H0v9c0,2.761,2.239,5,5,5h6.349c-2.041-1.65-3.349-4.171-3.349-7Z" />
                          </svg>
                        </div>
                        <div className="col-md-9">
                          <div className="card-body p-2">
                            <h6 className="card-title">
                              Hechos con más de 30 días sin cerrar
                            </h6>
                            <p className="card-text">
                              {overdueEventsCount}
                              <small className="text-danger">
                                {" "}
                                ({percentageOverdue}%){" "}
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SmallDashboardLoader />
                  )}
                </Suspense>
              </div>
            </div>

            <div className="overflow-y-auto d-flex flex-row flex-wrap align-content-stretch">
              {/* Mapa de Cuba */}
              <div className="col-lg-6 col-12 pt-2 px-1">
                <Suspense fallback={<LargeDashboardLoader />}>
                  {scopesByProvince.length !== 0 ? (
                    <div className="card shadow-sm h-100">
                      <h6 className="text-center w-100 pt-2">
                        Hechos por provincias
                      </h6>
                      <Map>
                        <VectorMap {...mapData} layerProps={layerProps} />
                      </Map>
                      <div className="d-flex flex-column w-100 text-center">
                        <h6>
                          Provincia: <span className="fw-light">{clicked}</span>
                        </h6>
                        <h6 className="fw-light">
                          <span className="fw-medium">{eventsByProvince}</span>{" "}
                          {eventsByProvince === 1
                            ? "hecho ocurrido y "
                            : "hechos ocurridos y "}
                          <span className="fw-medium">
                            {measuresByProvince}
                          </span>{" "}
                          {measuresByProvince === 1
                            ? "medida tomada"
                            : "medidas tomadas"}
                        </h6>
                      </div>
                    </div>
                  ) : (
                    <LargeDashboardLoader />
                  )}
                </Suspense>
              </div>

              {/* Resumen de sectores */}
              <div className="col-lg-6 col-12 pt-2 px-1">
                <Suspense fallback={<LargeDashboardLoader />}>
                  {percentageBySector.length !== 0 ? (
                    <div className="d-flex card shadow-sm py-2 h-100 justify-content-center align-items-center">
                      <h6 className="text-center w-100">
                        Porcentaje de hechos por sectores
                      </h6>
                      <PieChart percentageBySector={percentageBySector} />
                    </div>
                  ) : (
                    <LargeDashboardLoader />
                  )}
                </Suspense>
              </div>
            </div>

            <div className="overflow-y-auto d-flex flex-row flex-wrap align-content-stretch mb-2">
              {/* Resumen de Alcances */}
              <div className="col-lg-6 col-12 pt-2 px-1">
                <Suspense fallback={<LargeDashboardLoader />}>
                  {scopesByProvince.length !== 0 ? (
                    <div className="d-flex card shadow-sm h-100 w-100 justify-content-center align-items-center">
                      <h6 className="text-center w-100 pt-2">
                        Alcance de hechos por provincia
                      </h6>
                      <StackedBarChart scopes={scopesByProvince} />
                    </div>
                  ) : (
                    <LargeDashboardLoader />
                  )}
                </Suspense>
              </div>

              {/* Resumen de Tipos */}
              <div className="col-lg-6 col-12 pt-2 px-1">
                <Suspense fallback={<LargeDashboardLoader />}>
                  {eventsByType.length !== 0 ? (
                    <div className="d-flex card shadow-sm py-2 h-100 justify-content-center align-items-center">
                      <h6 className="text-center w-100 pt-2">
                        Cantidad de hechos por tipo
                      </h6>
                      <HorizontalBarChart typesData={eventsByType} />
                    </div>
                  ) : (
                    <LargeDashboardLoader />
                  )}
                </Suspense>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
