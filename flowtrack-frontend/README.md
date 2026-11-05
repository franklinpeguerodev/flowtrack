# Flowtrack — Frontend

Cliente web de Flowtrack, construido con **Next.js 16 (App Router)**, **React 19**,
**TypeScript**, **Tailwind CSS 4**, **Base UI/shadcn** y **Recharts**.

La documentación general del proyecto (arquitectura, API, reglas de negocio) está en el
[README principal](../README.md).

## Requisitos

- Node.js 20+
- La API de Flowtrack en ejecución (por defecto `http://localhost:5106`)

## Configuración

```bash
cp .env.example .env.local
npm install
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5106
```

## Scripts

```bash
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # ESLint
```

## Estructura

```
app/                Rutas (App Router): login, register, dashboard/*
components/         UI (ui/) y componentes de dominio
  reports/          Tarjetas y gráficos de reportes
context/            AuthProvider: sesión, token y perfil
hooks/              Acceso a la API por recurso
lib/                apiFetch, manejo de errores, utilidades de auth y reportes
types/              Tipos del contrato del backend
```

## Notas

- El token JWT se guarda en `localStorage`; el perfil se conserva aparte para sobrevivir recargas.
- Un `401` limpia la sesión y redirige a `/login`.
- La URL de la API se toma de `NEXT_PUBLIC_API_URL`.
- Los formularios de captura ofrecen solo categorías y métodos de pago activos.
