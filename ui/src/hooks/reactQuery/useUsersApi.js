import { useMutation } from "@tanstack/react-query";
import usersApi from "apis/users";


export const useCreateUser = onSuccessHandler =>
  useMutation({
    mutationFn: usersApi.create,
    onSuccess: onSuccessHandler,
  });

export const useSignInUser = onSuccessHandler =>
  useMutation({
    mutationFn: usersApi.signin,
    onSuccess: onSuccessHandler,
  });
