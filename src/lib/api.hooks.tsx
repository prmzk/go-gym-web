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
  headers?: Headers;
};

type UseApiQueryArgs<T> = UseQueryOptions<T> & CustomOption;

function useAPIQuery<T>(url: string, options: UseApiQueryArgs<T>) {
  const { toast } = useToast();

  const { isError, error, ...query } = useQuery<T>({
    queryFn: async () => {
      return await fetchData(url, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          ...(options.headers ? Object.fromEntries(options.headers) : {}),
        }),
      });
    },
    ...options,
  });

  useEffect(() => {
    if (
      isError &&
      !options?.disableToast &&
      !error?.message.includes("token")
    ) {
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

function useAPIQueryAuth<T>(url: string, options: UseApiQueryArgs<T>) {
  const { token, getRefresh } = useAuth();

  const { isError, error, ...query } = useAPIQuery<T>(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      ...(options.headers ? Object.fromEntries(options.headers) : {}),
    }),
    ...options,
  });

  useEffect(() => {
    const refreshToken = async () => {
      if (isError && getRefresh) {
        if (error?.message === "token") {
          const { isError: isErrorRefresh } = await getRefresh();
          if (!isErrorRefresh) query?.refetch();
        }
      }
    };

    refreshToken();
  }, [isError, error?.message, getRefresh, query]);

  return { isError, error, ...query };
}

type UseMutationArgs<TData, TReturn> = UseMutationOptions<
  TReturn,
  Error,
  TData
> &
  CustomOption & {
    method?: "POST" | "PUT" | "DELETE";
  };

function useAPIMutation<TData, TReturn = unknown>(
  url: string,
  options: UseMutationArgs<TData, TReturn>
) {
  const { toast } = useToast();
  const { isError, error, ...query } = useMutation<TReturn, Error, TData>({
    mutationFn: async (data: TData) => {
      return await fetchData(url, {
        method: options.method ?? "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          ...(options.headers ? Object.fromEntries(options.headers) : {}),
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

function useAPIMutationAuth<TData, TReturn = unknown>(
  url: string,
  options: UseMutationArgs<TData, TReturn>
) {
  const { token } = useAuth();
  const { isError, error, ...query } = useAPIMutation<TData, TReturn>(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      ...(options.headers ? Object.fromEntries(options.headers) : {}),
    }),
    ...options,
  });

  return { isError, error, ...query };
}

export { useAPIMutation, useAPIQuery, useAPIQueryAuth, useAPIMutationAuth };
