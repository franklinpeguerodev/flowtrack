export interface UpdateNameDto {
  name: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponseDto {
  id: string;
  name: string;
  email: string;
}