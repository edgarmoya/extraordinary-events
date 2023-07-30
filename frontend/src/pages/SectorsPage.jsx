import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import AuthContext from "../contexts/AuthContext";
import GridSectors from "../components/GridSectors";
import SectorService from "../api/sectors.api";
import Pagination from "../components/Pagination";
import TopBar from "../components/TopBar";
import Paths from "../routes/Paths";

function SectorsPage() {
  const { authTokens } = useContext(AuthContext);
  const [sectors, setSectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSectors, setTotalSectors] = useState(1);
  const location = useLocation();

  const loadSectors = useCallback(async () => {
    try {
      const response = await SectorService.getSectors(authTokens, currentPage);
      setCurrentPage(1);
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage]);

  const loadActiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getActiveSectors(
        authTokens,
        currentPage
      );
      setCurrentPage(1);
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage]);

  const loadInactiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getInactiveSectors(
        authTokens,
        currentPage
      );
      setCurrentPage(1);
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (location.pathname === Paths.ACTIVE_SECTORS) {
      loadActiveSectors();
    } else if (location.pathname === Paths.INACTIVE_SECTORS) {
      loadInactiveSectors();
    } else {
      loadSectors();
    }
  }, [
    location.pathname,
    currentPage,
    loadSectors,
    loadActiveSectors,
    loadInactiveSectors,
  ]);

  return (
    <Layout pageTitle="Sectores">
      <div className="container-fluid px-3 py-2">
        {/* Accions */}
        <TopBar />
        {/* Grid */}
        <div className="card border-secondary-subtle shadow-sm card-body mt-2 mx-1">
          <GridSectors data={sectors} />
          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalRows={totalSectors}
          />
        </div>
      </div>
    </Layout>
  );
}

export default SectorsPage;
