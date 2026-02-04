import * as Yup from "yup";

export const FORM_SCHEMA = Yup.object().shape({
  description: Yup.string()
    .min(10, "Please provide at least 10 characters")
    .max(1000, "Maximum 1000 characters allowed")
    .required("Please describe your problem"),
});

export const FORM_INITIAL_VALUES = {
  description: "",
};

export const DESCRIPTION_ROWS = 10;
