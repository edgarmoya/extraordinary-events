import { toast } from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "center-top",
    style: {
      maxWidth: "450px",
      //background: theme === "dark" ? "#333" : "#fff",
      //color: theme === "dark" ? "#fff" : "#333",
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "center-top",
    style: {
      maxWidth: "450px",
    },
  });
};
