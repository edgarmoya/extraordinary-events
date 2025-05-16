import { useState, useEffect, useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const useRolesInfo = () => {
  const { groupsInfo } = useContext(AuthContext);
  const [rolesInfo, setRolesInfo] = useState({
    isOperador: false,
    isAdministrador: false,
    isConsultor: false,
    isSuperuser: false,
  });

  useEffect(() => {
    if (groupsInfo !== null && groupsInfo.roles) {
      const isOperador = !!groupsInfo.roles.operador;
      const isAdministrador = !!groupsInfo.roles.administrador;
      const isConsultor = !!groupsInfo.roles.consultor;
      const isSuperuser = groupsInfo?.is_superuser;

      // Actualiza el estado de roles
      setRolesInfo({
        isOperador,
        isAdministrador,
        isConsultor,
        isSuperuser,
      });
    }
  }, [groupsInfo]);

  return rolesInfo;
};

export default useRolesInfo;
