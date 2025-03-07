import React, { useContext, useEffect, useState, useCallback } from "react";
import Modal from "../ui/Modal";
import AuthContext from "../../contexts/AuthContext";
import UserService from "../../api/users.api";

function ModalProfile({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [userGroupsData, setUserGroupsData] = useState([]);

  // Función para obtener datos del usuario
  const fetchUserData = useCallback(async () => {
    try {
      const response = await UserService.getUser(user.user_id);
      setUserData(response.data);
    } catch (error) {
      console.error("Error al obtener datos del usuario");
    }
  }, [user.user_id]);

  // Función para obtener grupos del usuario
  const fetchUserGroups = useCallback(async () => {
    try {
      const response = await UserService.getUserGroups(user.user_id);
      setUserGroupsData(response.data.groups);
    } catch (error) {
      console.error("Error al obtener grupos del usuario");
    }
  }, [user.user_id]);

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
      fetchUserGroups();
    }
  }, [isOpen, fetchUserData, fetchUserGroups]);

  return (
    <div>
      <Modal isOpen={isOpen} title={"Perfil"} onClose={onClose}>
        <div className="modal-body text-body-emphasis">
          {userData && (
            <div>
              <h6>
                <strong> - Usuario: </strong>
                {userData.user_name}
              </h6>
              <h6>
                <strong> - Nombre: </strong>
                {userData.first_name}
              </h6>
              <h6>
                <strong> - Apellidos: </strong>
                {userData.last_name}
              </h6>
            </div>
          )}

          {userGroupsData && (
            <div>
              <h6>
                <strong>
                  {userGroupsData.length === 1
                    ? " - Rol al que pertenece: "
                    : " - Roles a los que pertenece: "}
                </strong>
                {userGroupsData.length === 0
                  ? "Ninguno"
                  : userGroupsData.join(", ")}
              </h6>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalProfile;
