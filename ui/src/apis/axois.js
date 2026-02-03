
import axios from "axios";
import { toast } from "sonner";

import { SIGNIN_ROUTE } from "components/routeConstants";
import { getFromLocalStorage, clearLocalStorageCredentials } from "utils/storage";

axios.defaults.baseURL = "http://localhost:8000/api/";

const setAuthHeaders = () => {
  const apiKey = getFromLocalStorage("apiKey");
  axios.defaults.headers = {
  Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (apiKey) {
    axios.defaults.headers["X-Api-Key"] = apiKey;
  }
};

const resetApiKey = () =>
    delete axios.defaults.headers["X-Api-Key"];

const handleSuccessResponse = response => {
  if (response) {
    response.success = response.status === 200;
    if (response.data.notice) {
      toast.success(response.data.notice);
    }
  }

  return response;
};

const handleErrorResponse = (error) => {
  if (error.response?.status === 401) {
    resetApiKey();
    clearLocalStorageCredentials();
    toast.error(error.response?.data?.detail);

    if (window.location.pathname !== SIGNIN_ROUTE){
      window.location.href = SIGNIN_ROUTE;
    }
  } else {
    toast.error(error.response?.data?.detail || error.message);
  }

  return Promise.reject(error);
};

const registerIntercepts = () => {
  axios.interceptors.response.use(handleSuccessResponse, error =>
    handleErrorResponse(error)
  );
};

export { setAuthHeaders, resetApiKey, registerIntercepts };
