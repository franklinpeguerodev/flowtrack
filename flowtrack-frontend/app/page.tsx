import { redirect } from "next/navigation";

export default function Home() {
  // El layout de /dashboard redirige a /login si no hay sesión válida.
  redirect("/dashboard");
}
