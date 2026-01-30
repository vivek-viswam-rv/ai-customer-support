import { Formik, Form, Field } from "formik";
import { Button } from "shadcn/button";
import {
  FORM_SCHEMA,
  FORM_INITIAL_VALUES,
  DESCRIPTION_ROWS,
} from "./constants";

function UserInput() {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Problem submitted:", values);
    // Handle submission here
    setSubmitting(false);
    // Optionally reset after submission
    // resetForm();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Formik
        initialValues={FORM_INITIAL_VALUES}
        validationSchema={FORM_SCHEMA}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, resetForm }) => (
          <Form className="space-y-1">
            <div>
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-gray-700 mb-2 required"
              >
                Describe your problem
              </label>
              <Field name="problem">
                {({ field }) => (
                  <textarea
                    {...field}
                    id="problem"
                    autoFocus
                    rows={DESCRIPTION_ROWS}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none ${
                      touched.problem && errors.problem
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Please explain your issue in detail..."
                  />
                )}
              </Field>
              <div className="h-2">
                {touched.problem && errors.problem && (
                  <div className="text-error">{errors.problem}</div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="button-primary"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => resetForm()}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UserInput;
