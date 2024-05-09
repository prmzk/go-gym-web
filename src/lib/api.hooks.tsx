import { Toast, useToast } from "@/components/ui/use-toast";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import fetchData from "./api";
import { useAuth } from "./auth";

type ToastOption = {
  error?: Toast;
  success?: Toast;
};

type CustomOption = {
  toastOption?: ToastOption;
  disableToast?: boolean;
  noAuth?: boolean;
};

type UseApiQueryArgs<T> = UseQueryOptions<T> & CustomOption;

function useAPIQuery<T>(url: string, options: UseApiQueryArgs<T>) {
  const { toast } = useToast();
  const { token } = useAuth();

  const { isError, error, ...query } = useQuery<T>({
    queryFn: async () => {
      return await fetchData(url, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          ...(options.noAuth
            ? {}
            : {
                Authorization: `Bearer ${token}`,
              }),
        }),
      });
    },
    ...options,
  });

  useEffect(() => {
    if (isError && !options?.disableToast) {
      toast({
        variant: "destructive",
        description: error.message,
        ...options?.toastOption?.error,
      });
    }
  }, [
    isError,
    toast,
    error,
    options?.disableToast,
    options?.toastOption?.error,
  ]);

  return { isError, error, ...query };
}

type UseMutationArgs<TData, TReturn> = UseMutationOptions<
  TReturn,
  Error,
  TData
> &
  CustomOption;

function useAPIMutation<TData, TReturn = unknown>(
  url: string,
  options: UseMutationArgs<TData, TReturn>
) {
  const { toast } = useToast();
  const { token } = useAuth();
  const { isError, error, ...query } = useMutation<TReturn, Error, TData>({
    mutationFn: async (data: TData) => {
      return await fetchData(url, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          ...(options.noAuth
            ? {}
            : {
                Authorization: `Bearer ${token}`,
              }),
        }),
        body: JSON.stringify(data),
      });
    },
    ...options,
    onError: (error, variables, context) => {
      if (options?.disableToast) return;
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
        ...options?.toastOption?.error,
      });
      options?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      if (options?.disableToast) return;
      toast({
        title: "Success!",
        ...options?.toastOption?.success,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });

  return { isError, error, ...query };
}

export { useAPIMutation, useAPIQuery };
