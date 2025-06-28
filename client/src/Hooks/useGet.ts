import { useState, useEffect, useCallback } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;


export const refreshToken = async()=>{
  await fetch(`${baseUrl}/users/refresh-token`, {
    method: "POST",
    credentials: "include", 
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to refresh token");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.accessToken);
    })
    .catch((err) => {
      console.error("Error refreshing token:", err);
    });
  
}
const useGet = <TResponse>(
  endpoint?: string,
  options?: {
    headers?: Record<string, string>;
  }
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (signal?: AbortSignal, ep = endpoint, retry = true) => {
      if (!ep) return;

      try {
        setIsLoading(true);
        setError(null);
        const headers = { ...options?.headers };

        const response = await fetch(`${baseUrl}/${ep}`, {
          headers,
          signal,
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401 && retry) {
            try {
              await refreshToken();
              await new Promise((r) => setTimeout(r, 200));
              return fetchData(signal, ep, false);
            } catch (refreshErr) {
              throw new Error("Token refresh failed");
            }
          }
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, options]
  );

  useEffect(() => {
    if (!endpoint) return; 

    const controller = new AbortController();
    const signal = controller.signal;

    fetchData(signal);
    return () => {
      controller.abort(); 
    };

    return () => {
      controller.abort();
    };
  }, [fetchData, endpoint]);

  return { data, isLoading, error, fetchData };
};



export default useGet;

