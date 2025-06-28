
import { useState, useCallback } from "react";
import { refreshToken } from "./useGet";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const usePut = <TResponse, TRequest = any>(
  options?: {
    headers?: Record<string, string>;
  },
  shouldIncludeCredentials?: boolean
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const putData = useCallback(
    async (bodyData: TRequest | FormData, endpoint: string, retry = true) => {
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        setIsLoading(true);
        setError(null);
        const headers = { ...options?.headers };
        if (!(bodyData instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }
        const isAuth = shouldIncludeCredentials ?? true;
        const response = await fetch(`${baseUrl}/${endpoint}`, {
          method: "PUT",
          headers,
          body:
            bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData),
          signal,
          ...(isAuth && { credentials: "include" }),
        });
        if (!response.ok) {
          if (response.status === 401 && retry) {
            try {
              await refreshToken();
              await new Promise((r) => setTimeout(r, 200));
              return putData(bodyData, endpoint, false);
            } catch (refreshErr) {
              throw new Error("Token refresh failed");
            }
          }
          
          let errorMessage = `Error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData?.message) {
              errorMessage = errorData.message; 
            }
          } catch (_) {
            
          }

          
          throw new Error(errorMessage);
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
      return () => controller.abort();
    },
    [options]
  );
  return { data, isLoading, error, putData };
};
export default usePut;
