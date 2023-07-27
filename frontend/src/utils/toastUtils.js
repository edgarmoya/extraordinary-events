import { toast } from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "bottom-right",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "bottom-right",
  });
};
