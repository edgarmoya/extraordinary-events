import { useState, useEffect, useCallback } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import UserService from "../../../api/users.api";
import useApiMutation from "../../../hooks/useApiMutation";
import Spinner from "../../../ui/Spinner";
import useFetchData from "../../../hooks/useFetchData";
import EntityService from "../../../api/entities.api";
import Skeleton from "../../../ui/skeletons/Skeleton";

function ModalRoles({ isOpen, title, userId, onClose }) {
  const roleList = [
    { id: 2, role: "administrador" },
    { id: 3, role: "operador" },
    { id: 1, role: "consultor" },
  ];
  const [activeRole, setActiveRole] = useState("administrador"); // Rol seleccionado
  const [selectedRoles, setSelectedRoles] = useState({});

  const { data: entities, loading: loadingEntities } = useFetchData(
    isOpen ? EntityService.getEntities : null,
    [undefined, undefined, "True", undefined],
    [isOpen, userId]
  );

  const { data: activeEntities } = useFetchData(
    isOpen ? EntityService.getEntities : null,
    [undefined, undefined, "True", "administrador"],
    [isOpen, userId]
  );

  const fetchUserGroups = useCallback(() => {
    return isOpen ? UserService.getUserGroups(userId) : null;
  }, [isOpen, userId]);

  const { data, loading: loadingRoles } = useFetchData(
    isOpen ? fetchUserGroups : null,
    [userId],
    [userId]
  );

  useEffect(() => {
    if (data) {
      // Inicializa el estado con los roles por entidad
      const initialRoles = {};
      Object.entries(data.roles).forEach(([role, entities]) => {
        initialRoles[role] = {
          selected: entities.length > 0, // Si tiene entidades, lo marca como seleccionado
          entities: entities.map((entity) => entity.id),
        };
      });

      setSelectedRoles(initialRoles);
    }
  }, [data]);

  const handleCloseModal = () => {
    onClose();
  };

  const { execute: updateRoles, updating } = useApiMutation(
    UserService.updateRoles,
    {
      onSuccess: () => {
        showSuccessToast("Roles actualizados correctamente");
        handleCloseModal();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  // Manejar cambios en los checkboxes de roles
  const handleRoleChange = (role) => {
    setSelectedRoles((prev) => {
      const newRoles = { ...prev };

      if (newRoles[role]) {
        newRoles[role] = {
          ...newRoles[role],
          selected: !newRoles[role].selected, // Alternar el estado `selected` del rol
        };
      } else {
        // Si es la primera vez que se marca, inicializa con un array vacío de entidades
        newRoles[role] = { selected: true, entities: [] };
      }

      return newRoles;
    });
  };

  // Manejar cambios en los checkboxes de entidades
  const handleEntityChange = (role, entityId) => {
    setSelectedRoles((prev) => {
      const newRoles = { ...prev };

      if (!newRoles[role]) {
        newRoles[role] = { selected: true, entities: [] };
      }

      // Si la entidad ya existe, la eliminamos; si no, la agregamos
      if (newRoles[role].entities?.includes(entityId)) {
        // Si ya está, la eliminamos
        newRoles[role] = {
          ...newRoles[role],
          entities: newRoles[role].entities.filter((id) => id !== entityId),
        };
      } else {
        // Si no está, la agregamos
        newRoles[role] = {
          ...newRoles[role],
          entities: [...newRoles[role].entities, entityId],
        };
      }

      return newRoles;
    });
  };

  const formatedRoles = () => {
    const rolesObject = { roles: [] };

    Object.entries(selectedRoles).forEach(([role, data]) => {
      if (data.selected) {
        const roleId = roleList.find((r) => r.role === role)?.id;

        roleId &&
          data.entities.forEach((entity) => {
            rolesObject.roles.push({
              group_id: roleId, // Convertimos a número si es necesario
              entity_id: entity,
            });
          });
      }
    });

    return rolesObject;
  };

  const onSubmit = () => {
    updateRoles({ id: userId, roles: formatedRoles() });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={title}
        size={"modal-lg"}
        onClose={handleCloseModal}
      >
        <div className="modal-body text-body-emphasis">
          {loadingEntities | loadingRoles ? (
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <Skeleton>
                  <Skeleton.Rectangle height="220px" />
                </Skeleton>
              </div>
              <div className="col-12 col-md-6">
                <Skeleton>
                  <Skeleton.Rectangle height="220px" />
                </Skeleton>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column flex-md-row gap-2">
              <GroupCard title="Roles">
                <div className="d-flex flex-column gap-1">
                  {roleList.map(({ id, role }) => (
                    <div
                      key={id}
                      className="checkbox-container"
                      style={{
                        backgroundColor:
                          activeRole === role ? "var(--bs-secondary-bg)" : "",
                      }}
                      onClick={() => setActiveRole(role)}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={role}
                        id={`${role}Checkbox`}
                        checked={selectedRoles[role]?.selected || false}
                        onChange={(e) => handleRoleChange(e.target.value)}
                      />
                      <label className="form-check-label">{role}</label>
                    </div>
                  ))}
                </div>
              </GroupCard>
              <GroupCard title="Entidades">
                <div className="d-flex flex-column gap-1">
                  {activeRole ? (
                    entities?.map(({ id: id_entity, description }, index) => {
                      const enabled = activeEntities?.some(
                        (ae) => ae.id === id_entity
                      );
                      console.log(entities);
                      console.log(activeEntities);
                      return (
                        <div key={index} className="checkbox-container">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={id_entity}
                            id={`${id_entity}Checkbox`}
                            disabled={!enabled}
                            checked={
                              (selectedRoles[activeRole]?.selected &&
                                selectedRoles[activeRole].entities?.includes(
                                  id_entity
                                )) ||
                              false
                            }
                            onChange={() =>
                              handleEntityChange(activeRole, id_entity)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`${id_entity}Checkbox`}
                          >
                            {description}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <p>Selecciona un rol para ver las entidades</p>
                  )}
                </div>
              </GroupCard>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSubmit()}
            className="btn btn-primary text-white"
            disabled={updating}
          >
            {updating ? (
              <>
                <Spinner />
                Cambiando...
              </>
            ) : (
              "Cambiar"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

function GroupCard({ title, children }) {
  return (
    <div className="card my-1 w-100">
      <span className="card-header">{title}</span>
      <div
        className="card-body px-2 py-2 overflow-y-auto"
        style={{ maxHeight: "230px", minHeight: "230px" }}
      >
        {children}
      </div>
    </div>
  );
}

export default ModalRoles;
