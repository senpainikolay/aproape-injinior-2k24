import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessMessage = (
  message: string = "Operation was successful!",
  extraProps?: object
) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    style: {
      border: "1px solid grey",
    },
    ...extraProps,
  });
};

export const showErrorMessage = (
  message: string = "An error occurred",
  extraProps?: object
) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    style: {
      border: "1px solid grey",
    },
    ...extraProps,
  });
}; 