import { useState, useCallback } from "react";
import { refreshToken } from "./useGet";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const useDelete = <TResponse>(
  baseEndpoint: string,
  options?: {
    headers?: Record<string, string>;
  },
  shouldIncludeCredentials?: boolean
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = useCallback(
    async (id: string, retry = true) => {
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        setIsLoading(true);
        setError(null);
        const headers = { ...options?.headers };
        const isAuth = shouldIncludeCredentials ?? true;
        const response = await fetch(`${baseUrl}/${baseEndpoint}/${id}`, {
          method: "DELETE",
          headers,
          signal,
          ...(isAuth && { credentials: "include" }),
        });
        if (!response.ok) {
          if (response.status === 401 && retry) {
            try {
              await refreshToken();
              await new Promise((r) => setTimeout(r, 200));
              return deleteData(id, false);
            } catch (refreshErr) {
              throw new Error("Token refresh failed");
            }
          }
          // ✅ Try to read JSON body even in error
          const errRes = await response.json().catch(() => null);
          const errMsg =
            errRes?.message ||
            `Error: ${response.status} ${response.statusText}`;
          throw new Error(errMsg);
        }
        const responseData = await response.json();
        setData(responseData);
        return responseData;
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [baseEndpoint, options]
  );

  return { data, isLoading, error, deleteData };
};

export default useDelete;
