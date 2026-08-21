"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, TrendingUp } from "lucide-react";

import { useAuth } from "@/context/authContext";
import { ApiException } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    setGeneralError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      await login({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.error.errors) setFieldErrors(err.error.errors);
        else setGeneralError(err.error.message);
      } else {
        setGeneralError("Ocurrió un error inesperado. Intenta de nuevo.");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/[0.10] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md space-y-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20">
            <TrendingUp className="size-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight">Flowtrack</h1>
            <p className="text-base text-muted-foreground">
              Controla tus gastos con claridad
            </p>
          </div>
        </div>

        <Card className="border-border/60 py-8 shadow-xl shadow-black/[0.04]">
          <CardHeader className="px-8">
            <CardTitle className="text-xl">Inicia sesión en tu cuenta</CardTitle>
            <CardDescription className="text-base">
              Ingresa tu email para acceder a tu cuenta
            </CardDescription>
            <CardAction>
              <Link href="/register">
                <Button variant="link" className="px-0 text-base">
                  Regístrate
                </Button>
              </Link>
            </CardAction>
          </CardHeader>

          <CardContent className="px-8">

            <form id="login-form" action={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="h-12 text-base"
                  required
                />
                {fieldErrors.Email?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive">{msg}</p>
                ))}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-base">Contraseña</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline "
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                  required
                />
                {fieldErrors.Password?.map((msg, i) => (
                  <p key={i} className="text-sm text-destructive">{msg}</p>
                ))}
                {generalError && (
            <Alert variant="destructive" className="mb-6">
            <AlertCircle className="size-4" />
            <AlertTitle>No se pudo iniciar sesión</AlertTitle>
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
            )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2 px-8">
            <Button
              type="submit"
              form="login-form"
              className="h-12 w-full text-base font-medium cursor-pointer"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}