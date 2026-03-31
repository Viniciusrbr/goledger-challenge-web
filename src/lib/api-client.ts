const getAuthHeader = (): string => {
  const user = process.env.NEXT_PUBLIC_API_USER ?? "";
  const pass = process.env.NEXT_PUBLIC_API_PASS ?? "";
  return `Basic ${btoa(`${user}:${pass}`)}`;
};

const buildHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: getAuthHeader(),
});

export const apiPost = async <T>(
  endpoint: string,
  body: unknown,
): Promise<T> => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
};

export const apiPut = async <T>(
  endpoint: string,
  body: unknown,
): Promise<T> => {
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
};

export const apiDelete = async (
  endpoint: string,
  body: unknown,
): Promise<void> => {
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? `Request failed: ${res.status}`);
  }

  await res.json().catch(() => null);
};
