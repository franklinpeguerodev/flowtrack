"use client";

import { apiFetch } from "@/lib/api";
import { UpdateNameDto, ChangePasswordDto, UserProfileResponseDto } from "@/types/user";

export function useUserProfile() {
  async function updateName(dto: UpdateNameDto) {
    // El backend devuelve { id, name, email }. El nombre mostrado en la UI se toma
    // del valor enviado (no se depende de la respuesta) y se persiste en el contexto.
    return apiFetch<UserProfileResponseDto>("/api/userprofiles/name", {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  }

  async function changePassword(dto: ChangePasswordDto) {
    return apiFetch<void>("/api/userprofiles/password", {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  }

  return { updateName, changePassword };
}
