import * as Yup from "yup";

export const LOGIN_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const FORM_INITIAL_VALUES = {
    email: "",
    password: "",
};
