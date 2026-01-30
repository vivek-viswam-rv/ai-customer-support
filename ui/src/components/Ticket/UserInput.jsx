import { Formik, Form, Field } from "formik";
import { Button } from "shadcn/button";
import { FORM_SCHEMA, DESCRIPTION_ROWS } from "./constants";
import { useEffect } from "react";
import { useRef } from "react";

function UserInput({
  problemDescription,
  setProblemDescription,
  setShouldShowResponse,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.setSelectionRange(
      inputRef.current.value.length,
      inputRef.current.value.length
    );
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Formik
        initialValues={{ problem: problemDescription }}
        validationSchema={FORM_SCHEMA}
        validateOnBlur={false}
        onSubmit={(values) => {
          setProblemDescription(values.problem);
          setShouldShowResponse(true);
        }}
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
                    ref={inputRef}
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
