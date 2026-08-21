export type ErrorType =
  | "DUPLICATE_RESOURCE"
  | "RESOURCE_NOT_FOUND"
  | "INVALID_CREDENTIALS"
  | "FORBIDDEN_OPERATION"
  | "BUSINESS_RULE_VIOLATION"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface ApiError {
  statusCode: number;
  errorType: ErrorType;
  message: string;
  errors: Record<string, string[]> | null;
  requestId: string;
}