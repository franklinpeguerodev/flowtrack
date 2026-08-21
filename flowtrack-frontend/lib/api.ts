import { ApiError } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiException extends Error {
  constructor(public error: ApiError) {
    super(error.message);
    this.name = "ApiException";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody: ApiError = await res.json();
    throw new ApiException(errorBody);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}