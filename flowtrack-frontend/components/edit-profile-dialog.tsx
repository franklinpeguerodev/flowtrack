"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/context/authContext";
import { ApiException } from "@/lib/api";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateUser } = useAuth();
  const { updateName, changePassword } = useUserProfile();

  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameFieldErrors, setNameFieldErrors] = useState<Record<string, string[]>>({});

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<Record<string, string[]>>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) return null;

  async function handleNameSubmit(formData: FormData) {
    setNameError(null);
    setNameFieldErrors({});
    setNameLoading(true);

    const newName = formData.get("name") as string;

    try {
      await updateName({ name: newName });
      updateUser({ name: newName });
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.error.errors) setNameFieldErrors(err.error.errors);
        else setNameError(err.error.message);
      } else {
        setNameError("No se pudo actualizar el nombre.");
      }
    } finally {
      setNameLoading(false);
    }
  }

  async function handlePasswordSubmit(formData: FormData) {
    setPasswordError(null);
    setPasswordFieldErrors({});
    setPasswordSuccess(false);
    setPasswordLoading(true);

    try {
      await changePassword({
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
      });
      setPasswordSuccess(true);
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.error.errors) setPasswordFieldErrors(err.error.errors);
        else setPasswordError(err.error.message);
      } else {
        setPasswordError("No se pudo cambiar la contraseña.");
      }
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Actualiza tu nombre o tu contraseña.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="name">
          <TabsList className="w-full">
            <TabsTrigger value="name" className="flex-1">Nombre</TabsTrigger>
            <TabsTrigger value="password" className="flex-1">Contraseña</TabsTrigger>
          </TabsList>

          <TabsContent value="name" className="space-y-4 pt-2">
            {nameError && (
              <Alert variant="destructive">
                <AlertDescription>{nameError}</AlertDescription>
              </Alert>
            )}

            <form action={handleNameSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input key={user.name} id="name" name="name" defaultValue={user.name} required />
                {nameFieldErrors.Name?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive">{msg}</p>
                ))}
              </div>

              <Button type="submit" disabled={nameLoading} className="w-full">
                {nameLoading && <Loader2 className="animate-spin" />}
                {nameLoading ? "Guardando..." : "Guardar nombre"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password" className="space-y-4 pt-2">
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert>
                <AlertDescription>Contraseña actualizada correctamente.</AlertDescription>
              </Alert>
            )}

            <form action={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
                {passwordFieldErrors.CurrentPassword?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive">{msg}</p>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
                {passwordFieldErrors.NewPassword?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive">{msg}</p>
                ))}
              </div>

              <Button type="submit" disabled={passwordLoading} className="w-full">
                {passwordLoading && <Loader2 className="animate-spin" />}
                {passwordLoading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}