import { isPresent } from "utils";

const setToLocalStorage = (key, value) => {
  if (value !== null) {
    localStorage.setItem(key, JSON.stringify(value));
  } else localStorage.removeItem(key);
};

const getFromLocalStorage = key => {
    const value = localStorage.getItem(key);

    return isPresent(value) ? JSON.parse(value) : null;
};

const clearLocalStorageCredentials = () =>
  setToLocalStorage("apiKey", null);

export { setToLocalStorage, getFromLocalStorage, clearLocalStorageCredentials };
