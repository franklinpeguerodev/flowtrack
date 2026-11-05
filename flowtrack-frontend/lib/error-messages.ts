import { ApiError } from "@/types/api";

/**
 * Mensajes legibles por tipo de error. Se usan cuando el mensaje del backend no
 * llega o llega con caracteres dañados (UTF-8 mal codificado).
 */
const ERROR_MESSAGES: Record<string, string> = {
  DUPLICATE_RESOURCE: "Ese nombre ya está en uso.",
  RESOURCE_NOT_FOUND: "El recurso solicitado no existe.",
  INVALID_CREDENTIALS: "Las credenciales no son correctas.",
  FORBIDDEN_OPERATION: "No se puede realizar esta operación.",
  BUSINESS_RULE_VIOLATION: "La operación no cumple las reglas del sistema.",
  VALIDATION_ERROR: "Revisa los datos ingresados.",
  INTERNAL_ERROR: "Ocurrió un error inesperado. Intenta más tarde.",
};

// Caracteres típicos de una cadena UTF-8 interpretada con el encoding equivocado.
const BROKEN_TEXT = /[\uFFFD\u00C2\u00C3]/;

export function readableErrorMessage(error: ApiError, fallback?: string): string {
  const message = error.message?.trim();

  if (message && !BROKEN_TEXT.test(message)) {
    return message;
  }

  return (
    ERROR_MESSAGES[error.errorType] ??
    fallback ??
    "Ocurrió un error inesperado. Intenta más tarde."
  );
}
