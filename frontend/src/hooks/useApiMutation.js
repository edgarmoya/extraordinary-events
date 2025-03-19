import { useState } from "react";

const useApiMutation = (apiCall, { onSuccess, onError } = {}) => {
  const [loading, setLoading] = useState(false);

  const execute = async (data, setError) => {
    setLoading(true);
    try {
      const response = await apiCall(data);

      if ([200, 201, 204].includes(response.status)) {
        onSuccess?.(response);
      } else {
        onError?.("Error en la solicitud");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (setError && typeof setError === "function") {
          Object.entries(data).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setError(field, { type: "server", message: messages[0] });
            }
          });
        }

        data?.detail && onError?.(data?.detail);
      } else if (error.request) {
        onError?.("No se pudo conectar al servidor");
      } else {
        onError?.("Error al realizar la solicitud");
      }
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export default useApiMutation;
