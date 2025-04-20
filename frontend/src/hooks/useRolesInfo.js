import { useState, useEffect, useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const useRolesInfo = () => {
  const { groupsInfo } = useContext(AuthContext);
  const [rolesInfo, setRolesInfo] = useState({
    isOperador: false,
    operador: [],
    isAdministrador: false,
    administrador: [],
    isConsultor: false,
    consultor: [],
    isSuperuser: false,
  });

  useEffect(() => {
    if (groupsInfo !== null && groupsInfo.roles) {
      const isOperador = !!groupsInfo.roles.operador;
      const operador = groupsInfo.roles.operador || [];
      const isAdministrador = !!groupsInfo.roles.administrador;
      const administrador = groupsInfo.roles.administrador || [];
      const isConsultor = !!groupsInfo.roles.consultor;
      const consultor = groupsInfo.roles.consultor || [];
      const isSuperuser = groupsInfo?.is_superuser;

      // Actualiza el estado de roles
      setRolesInfo({
        isOperador,
        operador,
        isAdministrador,
        administrador,
        isConsultor,
        consultor,
        isSuperuser,
      });
    }
  }, [groupsInfo]);

  return rolesInfo;
};

export default useRolesInfo;
