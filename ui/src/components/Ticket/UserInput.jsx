import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";

import { Button } from "shadcn/button";
import { useCreateTicket } from "hooks/reactQuery/useTicketsApi";

import {
  FORM_SCHEMA,
  DESCRIPTION_ROWS,
  FORM_INITIAL_VALUES,
} from "./constants";
import { TICKETS_RESPONSE_ROUTE } from "../routeConstants";

function UserInput() {
  const navigate = useNavigate();
  const { isSubmitting, mutate: createTicket } = useCreateTicket(
    ({ data: { ticket_id } }) => {
      navigate(TICKETS_RESPONSE_ROUTE.replace(":ticketId", ticket_id));
    }
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Formik
        initialValues={FORM_INITIAL_VALUES}
        validationSchema={FORM_SCHEMA}
        validateOnBlur={false}
        onSubmit={createTicket}
      >
        {({ errors, touched, resetForm }) => (
          <Form className="space-y-1">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2 required"
              >
                Describe your problem
              </label>
              <Field name="description">
                {({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    autoFocus
                    rows={DESCRIPTION_ROWS}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none ${
                      touched.description && errors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Please explain your issue in detail..."
                  />
                )}
              </Field>
              <div className="h-2">
                {touched.description && errors.description && (
                  <div className="text-error">{errors.description}</div>
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
