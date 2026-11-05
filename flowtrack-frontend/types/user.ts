export interface UpdateNameDto {
  name: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// El backend devuelve { id, name, email }; name/email se marcan opcionales porque
// historicamente el DTO los exponía como campos y no se serializaban.
export interface UserProfileResponseDto {
  id: string;
  name?: string;
  email?: string;
}
