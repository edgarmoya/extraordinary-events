import React, { useContext, useEffect, useState, useMemo } from "react";
import Modal from "./Modal";
import AuthContext from "../contexts/AuthContext";
import UserService from "../api/users.api";

function ModalProfile({ isOpen, onClose }) {
  const { user, authTokens } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [userGroupsData, setUserGroupsData] = useState([]);

  const handleUser = useMemo(() => {
    return () => {
      UserService.getUser(authTokens, user.user_id)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.log("Error al obtener datos del usuario.");
        });
    };
  }, [authTokens, user.user_id]);

  const handleGroups = useMemo(() => {
    return () => {
      UserService.getUserGroups(authTokens, user.user_id)
        .then((response) => {
          setUserGroupsData(response.data.groups);
        })
        .catch((error) => {
          console.log(
            "Error al obtener grupos a los que pertenece el usuario."
          );
        });
    };
  }, [authTokens, user.user_id]);

  useEffect(() => {
    handleUser();
    handleGroups();
  }, [handleGroups, handleUser]);

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
