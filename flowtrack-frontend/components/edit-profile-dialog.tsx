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
import { getErrorMessage } from "@/lib/api";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateUser } = useAuth();
  const { updateName, changePassword } = useUserProfile();

  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) return null;

  async function handleNameSubmit(formData: FormData) {
    setNameError(null);
    setNameLoading(true);

    const newName = (formData.get("name") as string).trim();

    try {
      await updateName({ name: newName });
      // El backend no emite un token nuevo al actualizar el nombre: el valor
      // mostrado sale del estado local y se persiste para sobrevivir a la recarga.
      updateUser({ name: newName });
      onOpenChange(false);
    } catch (err) {
      setNameError(getErrorMessage(err, "No se pudo actualizar el nombre."));
    } finally {
      setNameLoading(false);
    }
  }

  async function handlePasswordSubmit(formData: FormData) {
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordLoading(true);

    try {
      await changePassword({
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
      });
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(getErrorMessage(err, "No se pudo cambiar la contraseña."));
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
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={user.email} readOnly disabled />
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
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
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
