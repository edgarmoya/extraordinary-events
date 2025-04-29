import React, { useContext, useEffect, useState, useCallback } from "react";
import Modal from "../../ui/modals/Modal";
import AuthContext from "../../contexts/AuthContext";
import UserService from "../../api/users.api";
import useFetchData from "../../hooks/useFetchData";
import Skeleton from "../../ui/skeletons/Skeleton";

function ModalProfile({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  const fetchUserGroups = useCallback(() => {
    return isOpen ? UserService.getUserGroups(user.user_id) : null;
  }, [isOpen, user.user_id]);

  const { data, loading } = useFetchData(
    isOpen ? fetchUserGroups : null,
    [user.user_id],
    [user.user_id]
  );

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  return (
    <>
      <Modal isOpen={isOpen} title={"Perfil"} onClose={onClose}>
        <div className="modal-body text-body-emphasis">
          {loading ? (
            <Skeleton>
              <Skeleton.Text width="50%" position="center" className="mt-1" />
              <Skeleton.Text width="70%" position="center" className="mt-1" />
              <Skeleton.Text width="50%" className="mt-3" />
              <Skeleton.Rectangle height="120px" className="mt-2" />
              <Skeleton.Rectangle height="120px" className="mt-2" />
            </Skeleton>
          ) : (
            <div className="d-flex flex-column">
              <div className="text-center">
                <h6 className="mt-2 fs-4 fw-semibold">
                  {`${userData.first_name} ${userData.last_name}`}
                </h6>
                <p className="fs-6 fw-light">{`@${userData.user_name} - Registrado el ${userData.start_date}`}</p>
              </div>
              <div>
                <div className="fs-6 fw-semibold py-1">Roles por entidad</div>
                <hr className="text-body my-0" />
                {userData.is_superuser ? (
                  <div className="card mt-3 text-center p-3">
                    <span>Usted tiene todos los permisos asignados</span>
                  </div>
                ) : userData.roles && Object.keys(userData.roles).length > 0 ? (
                  <>
                    {userData.roles.administrador && (
                      <RoleCard
                        roleName="Administrador"
                        role={userData.roles.administrador}
                      />
                    )}
                    {userData.roles.operador && (
                      <RoleCard
                        roleName="Operador"
                        role={userData.roles.operador}
                      />
                    )}
                    {userData.roles.consultor && (
                      <RoleCard
                        roleName="Consultor"
                        role={userData.roles.consultor}
                      />
                    )}
                  </>
                ) : (
                  <div className="card mt-3 text-center p-3">
                    <span>Usted no tiene asignado ningún permiso</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </Modal>
    </>
  );
}

function RoleCard({ roleName, role }) {
  return (
    <div className="card mt-3">
      <span className="card-header">{roleName}</span>
      <div
        className="card-body px-2 py-2 overflow-y-auto"
        style={{ maxHeight: "100px" }}
      >
        <ul className="m-0">
          {role.map((el, index) => (
            <li key={index}>{el.entity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ModalProfile;
