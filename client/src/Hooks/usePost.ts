
import { useState, useCallback, useRef, useEffect } from "react";
import { refreshToken } from "./useGet";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const usePost = <TResponse, TRequest = any>(
  options?: {
    headers?: Record<string, string>;
  },
  shouldIncludeCredentials?: boolean
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAuth = shouldIncludeCredentials ?? true;
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const postData = useCallback(
    async (
      bodyData: TRequest | FormData,
      url: string,
      retry = true
    ): Promise<TResponse> => {
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        setIsLoading(true);
        setError(null);

        const headers = { ...options?.headers };
        if (!(bodyData instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(`${baseUrl}/${url}`, {
          method: "POST",
          headers,
          body:
            bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData),
          signal,
          ...(isAuth && { credentials: "include" }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (response.status === 401 && retry) {
            try {
              await refreshToken();
              await new Promise((r) => setTimeout(r, 200));
              return postData(bodyData, url, false);
            } catch (refreshErr) {
              throw new Error("Token refresh failed");
            }
          }
          throw new Error(
            responseData.message ||
              `Error: ${response.status} ${response.statusText}`
          );
        }

        setData(responseData);
        return responseData;
      } catch (err: any) {
        if (err.name === "AbortError") {
          throw err;
        }
        const errorMessage = err.message || "Something went wrong";
        setError(errorMessage);
        throw err; 
      } finally {
        setIsLoading(false);
      }
    },
    [options, shouldIncludeCredentials]
  );

  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  
  const onClose = () => {
    setError(null);
  };

  return { data, isLoading, error, postData, onClose };
};

export default usePost;
