import { ToasterToast, useToast } from "@/components/ui/use-toast";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import fetchData from "./api";

function useAPIQuery<T>(
  url: string,
  options: UseQueryOptions<T> & {
    toastOption?: Omit<ToasterToast, "id">;
  }
) {
  const { isError, error, ...query } = useQuery<T>({
    queryFn: async () => {
      return await fetchData(url, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    },
    ...options,
  });
  const { toast } = useToast();

  if (isError) {
    toast({
      title: "Error",
      variant: "destructive",
      description: error.message,
      ...options?.toastOption,
    });
  }

  return { isError, error, ...query };
}

function useAPIMutation<TData, TReturn = unknown>(
  url: string,
  options?: UseMutationOptions<TReturn, Error, TData> & {
    toastOption?: Omit<ToasterToast, "id">;
  }
) {
  const { toast } = useToast();
  const { isError, error, ...query } = useMutation<TReturn, Error, TData>({
    mutationFn: async (data: TData) => {
      return await fetchData(url, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
        ...options?.toastOption,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        ...options?.toastOption,
      });
    },
    ...options,
  });

  return { isError, error, ...query };
}

export { useAPIQuery, useAPIMutation };
