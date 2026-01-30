import { Formik, Form, Field } from "formik";
import { Button } from "shadcn/button";
import { FORM_INITIAL_VALUES, LOGIN_SCHEMA } from "./constants";

function Login() {
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Login attempt:", values);
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-standard px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-gray-600">Sign in to your account</p>

        <Formik
          initialValues={FORM_INITIAL_VALUES}
          validationSchema={LOGIN_SCHEMA}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="space-y-1.5 mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="h-16">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`mt-1 block w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="you@example.com"
                  />
                  <div className="mt-1 text-error">
                    {touched.email && errors.email}
                  </div>
                </div>

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="h-16">
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`mt-1 block w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Password"
                  />
                  <div className="mt-1 text-error">
                    { touched.password && errors.password }
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full button-primary"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
