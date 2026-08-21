"use client";

import { apiFetch } from "@/lib/api";
import { UpdateNameDto, ChangePasswordDto, UserProfileResponseDto } from "@/types/user";

export function useUserProfile() {
  async function updateName(dto: UpdateNameDto) {
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