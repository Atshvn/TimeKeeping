import { toast } from 'react-toastify';

export const ToastSuccess = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_CENTER
    });
}

export const ToastSuccessRight = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
    });
}
export const ToastError = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_CENTER
    });
}
export const ToastErrorRight = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
    });
}
export const ToastWarning = (message) => {
    toast.warn(message, {
        position: toast.POSITION.TOP_CENTER
    });
}
export const ToastWarningRight = (message) => {
    toast.warn(message, {
        position: toast.POSITION.TOP_RIGHT
    });
}
export const ToastInfo = (message) => {
    toast.info(message, {
        position: toast.POSITION.TOP_CENTER
    });
}
export const ToastDark = (message) => {
    toast.dark(message, {
        position: toast.POSITION.TOP_CENTER
    });
}
export const ToastLight = (message) => {
    toast.light(message, {
        position: toast.POSITION.TOP_CENTER
    });
}
export const ToastDefault = (message) => {
    toast(message, {
        position: toast.POSITION.TOP_CENTER
    });
}

export const ToastLoading = (message) => {
    toast.loading(message, {
        position: toast.POSITION.TOP_RIGHT
    });
   
}

