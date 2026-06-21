export function customFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  return fetch(url, { ...options, headers, credentials: "include" }).then(async (res) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw Object.assign(new Error(data.error ?? res.statusText), {
        status: res.status,
        data,
      });
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  });
}
