import { toast } from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "center-top",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "center-top",
  });
};
