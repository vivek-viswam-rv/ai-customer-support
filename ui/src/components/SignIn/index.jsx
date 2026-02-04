import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "shadcn/button";
import { useCreateUser, useSignInUser } from "hooks/reactQuery/useUsersApi";
import { setToLocalStorage } from "utils/storage";

import { FORM_INITIAL_VALUES, LOGIN_SCHEMA } from "./constants";
import { SIGNIN_ROUTE, SIGNUP_ROUTE, TICKETS_ROUTE } from "../routeConstants";
import { useRef } from "react";
import { useEffect } from "react";

function SignIn() {
  const pathname = window.location.pathname;
  const isLoginPage = pathname === SIGNIN_ROUTE;
  const loadingText = isLoginPage ? "Signing in..." : "Signing up...";
  const buttonText = isLoginPage ? "Sign in" : "Sign up";

  const formRef = useRef();
  const emailRef = useRef();
  const navigate = useNavigate();
  const { isSubmitting: isSigningIn, mutate: signInUser } = useSignInUser(
    ({ data: { api_key } }) => {
      setToLocalStorage("apiKey", api_key);
      window.location.replace(TICKETS_ROUTE);
    }
  );

  const { isSubmitting: isSigningUp, mutate: signUpUser } = useCreateUser(() =>
    navigate(SIGNIN_ROUTE, { replace: true })
  );

  useEffect(() => {
    formRef.current?.resetForm();
    emailRef.current?.focus();
  }, [isLoginPage]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-standard px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{buttonText}</h1>
        <p className="text-gray-600">
          {buttonText} to {isLoginPage ? "your" : "create a new"} account
        </p>

        <Formik
          initialValues={FORM_INITIAL_VALUES}
          validateOnBlur={false}
          validationSchema={LOGIN_SCHEMA}
          onSubmit={isLoginPage ? signInUser : signUpUser}
          innerRef={formRef}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="space-y-1.5 mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 required"
                >
                  Email
                </label>
                <div className="h-16">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    innerRef={emailRef}
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
                  className="block text-sm font-medium text-gray-700 required"
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
                    {touched.password && errors.password}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSigningIn || isSigningUp}
                className="w-full button-primary"
              >
                {isSigningIn || isSigningUp ? loadingText : buttonText}
              </Button>
            </Form>
          )}
        </Formik>

        {isLoginPage ? (
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to={SIGNUP_ROUTE}
              replace
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to={SIGNIN_ROUTE}
              replace
              className="text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;
