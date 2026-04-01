const getAuthHeader = (): string => {
  const user = process.env.NEXT_PUBLIC_API_USER ?? "";
  const pass = process.env.NEXT_PUBLIC_API_PASS ?? "";
  return `Basic ${btoa(`${user}:${pass}`)}`;
};

const buildHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: getAuthHeader(),
});

/** Server-side fetch needs an absolute URL so Next rewrites proxy to the GoLedger API. */
const resolveFetchUrl = (endpoint: string): string => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  if (typeof window === "undefined") {
    const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
    if (base) {
      return `${base}${endpoint}`;
    }
  }
  return endpoint;
};

const serverFetchInit = (): Pick<RequestInit, "cache"> | undefined =>
  typeof window === "undefined" ? { cache: "no-store" } : undefined;

const apiFetch = async (
  method: string,
  endpoint: string,
  body: unknown,
): Promise<Response> => {
  const res = await fetch(resolveFetchUrl(endpoint), {
    method,
    headers: buildHeaders(),
    body: JSON.stringify(body),
    ...serverFetchInit(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? `Request failed: ${res.status}`);
  }

  return res;
};

export const apiPost = async <T>(endpoint: string, body: unknown): Promise<T> =>
  (await apiFetch("POST", endpoint, body)).json();

export const apiPut = async <T>(endpoint: string, body: unknown): Promise<T> =>
  (await apiFetch("PUT", endpoint, body)).json();

export const apiDelete = async (
  endpoint: string,
  body: unknown,
): Promise<void> => {
  await apiFetch("DELETE", endpoint, body);
};
