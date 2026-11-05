import { getToken, clearToken, clearProfile } from "@/lib/auth";
import { ApiError, ErrorType } from "@/types/api";
import { readableErrorMessage } from "@/lib/error-messages";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5106";

export class ApiException extends Error {
  constructor(public error: ApiError) {
    super(error.message);
    this.name = "ApiException";
  }
}

function fallbackType(status: number): ErrorType {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "INVALID_CREDENTIALS";
    case 403:
      return "FORBIDDEN_OPERATION";
    case 404:
      return "RESOURCE_NOT_FOUND";
    case 409:
      return "DUPLICATE_RESOURCE";
    default:
      return "INTERNAL_ERROR";
  }
}

function fallbackMessage(status: number): string {
  if (status === 401) return "Tu sesión expiró. Inicia sesión de nuevo.";
  if (status === 403) return "No tienes permiso para realizar esta operación.";
  if (status === 404) return "El recurso solicitado no existe.";
  if (status === 409) return "El recurso ya existe.";
  if (status >= 500) return "Ocurrió un error inesperado. Intenta más tarde.";
  return "No se pudo completar la operación.";
}

/**
 * Convierte cualquier cuerpo de error en un ApiError.
 * Tolera: ErrorResponse del middleware, ProblemDetails de validación de MVC,
 * cuerpos vacíos y respuestas que no son JSON.
 */
async function buildApiError(res: Response): Promise<ApiError> {
  const text = await res.text().catch(() => "");
  let payload: Record<string, unknown> = {};

  if (text) {
    try {
      payload = JSON.parse(text) as Record<string, unknown>;
    } catch {
      payload = {};
    }
  }

  const rawType = payload.errorType ?? payload.errortype;
  const errorType: ErrorType =
    typeof rawType === "string" && rawType.length > 0
      ? (rawType.toUpperCase() as ErrorType)
      : fallbackType(res.status);

  const rawMessage =
    typeof payload.message === "string" && payload.message.trim().length > 0
      ? payload.message
      : typeof payload.title === "string" && payload.title.trim().length > 0
        ? payload.title
        : fallbackMessage(res.status);

  const errors =
    payload.errors && typeof payload.errors === "object"
      ? (payload.errors as Record<string, string[]>)
      : null;

  return {
    statusCode: typeof payload.statusCode === "number" ? payload.statusCode : res.status,
    errorType,
    message: rawMessage,
    errors,
    requestId: typeof payload.requestId === "string" ? payload.requestId : "",
  };
}

function handleUnauthorized(hadToken: boolean) {
  if (!hadToken || typeof window === "undefined") return;
  clearToken();
  clearProfile();
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiException({
      statusCode: 0,
      errorType: "INTERNAL_ERROR",
      message: "No se pudo conectar con el servidor. Verifica tu conexión.",
      errors: null,
      requestId: "",
    });
  }

  if (!res.ok) {
    handleUnauthorized(!!token);
    throw new ApiException(await buildApiError(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

/** Devuelve el mensaje legible de cualquier error capturado. */
export function getErrorMessage(err: unknown, fallback?: string): string {
  return err instanceof ApiException
    ? readableErrorMessage(err.error)
    : (fallback ?? "Ocurrió un error inesperado. Intenta de nuevo.");
}
