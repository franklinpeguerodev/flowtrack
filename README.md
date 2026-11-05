# Flowtrack

Aplicación web para la **gestión y el análisis de gastos personales**. Permite registrar gastos,
organizarlos por categoría y método de pago, definir presupuestos mensuales con alertas, consultar
reportes y exportar la información.

> Proyecto académico desarrollado para la asignatura **Programación 3**.

---

## Características

- **Autenticación con JWT**: registro, inicio de sesión y cierre de sesión con revocación de tokens.
- **Categorías** y **métodos de pago**: alta, edición, activación/desactivación y borrado protegido.
- **Gastos**: CRUD completo con monto, fecha, descripción, categoría y método de pago.
- **Presupuestos mensuales** por categoría, con estado de consumo y alertas:
  - `Normal` → menos del 50 %
  - `Warning50` → 50 % o más
  - `Warning80` → 80 % o más
  - `Warning100` → exactamente 100 % (al límite)
  - `Exceeded` → más de 100 % (superado)
- **Reportes**: resumen del mes actual, comparación con el mes anterior, desglose por categoría y por
  método de pago, filtros por rango de fechas.
- **Importación** de gastos desde Excel (`.xlsx`) con reporte de errores por fila.
- **Exportación** de reportes mensuales en JSON, TXT o Excel.
- **Perfil**: cambio de nombre y de contraseña.

## Stack

| Capa | Tecnologías |
|---|---|
| Backend | .NET 10 · ASP.NET Core · Entity Framework Core 9 · Pomelo MySQL · JWT Bearer · BCrypt · ClosedXML · OpenAPI/Scalar |
| Base de datos | MySQL 8 |
| Frontend | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Base UI/shadcn · Recharts |

## Arquitectura

El backend está dividido en cuatro capas con dependencias unidireccionales:

```
flowtrack.Api  →  flowtrack.BLL  →  flowtrack.DAL  →  flowtrack.Entities
   (HTTP)          (negocio)        (persistencia)     (modelo)
```

- **`flowtrack.Entities`**: entidades del dominio (`User`, `Category`, `PaymentMethod`, `Expense`, `Budget`).
- **`flowtrack.DAL`**: `DbContext`, configuraciones de EF Core, repositorios y migraciones.
- **`flowtrack.BLL`**: servicios, DTOs, mapeos, validaciones y excepciones de negocio.
- **`flowtrack.Api`**: controladores, autenticación JWT, CORS, manejo global de excepciones y arranque.
- **`flowtrack-frontend`**: cliente Next.js que consume la API; no accede a la base de datos.

Principios aplicados:

- El `userId` **siempre** se obtiene del claim del token; nunca se recibe desde el cliente.
- Toda operación valida la propiedad del recurso (aislamiento por usuario).
- Los errores de negocio se traducen a códigos HTTP con un contrato uniforme.
- Los secretos se cargan desde `.env` (fuera de git) con precedencia
  `variables de entorno > .env > appsettings.json`.

## Requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) y npm
- [MySQL 8](https://dev.mysql.com/downloads/) en ejecución
- Herramientas de EF Core (opcional, para migraciones):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Configuración y ejecución

### 1. Base de datos

Crea la base (el nombre es configurable):

```sql
CREATE DATABASE flowtrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
# 1) Configura los secretos locales
cp flowtrack.Api/.env.example flowtrack.Api/.env
#    Edita flowtrack.Api/.env con tu cadena de conexión y una clave JWT propia

# 2) Aplica las migraciones
dotnet ef database update --project flowtrack.DAL --startup-project flowtrack.Api

# 3) Ejecuta la API (perfil http → http://localhost:5106)
dotnet run --project flowtrack.Api --launch-profile http
```

La documentación interactiva (Scalar) queda disponible en `http://localhost:5106/scalar/v1`
solo en entorno `Development`.

### 3. Frontend

```bash
cd flowtrack-frontend

# 1) URL de la API
cp .env.example .env.local

# 2) Dependencias
npm install

# 3) Desarrollo
npm run dev        # http://localhost:3000
```

Para producción: `npm run build` y `npm run start`.

## Variables de entorno

### Backend (`flowtrack.Api/.env`)

El archivo usa el formato de .NET: `__` equivale a `:` en la ruta de configuración.

```env
ConnectionStrings__Default=server=localhost;port=3306;database=flowtrack;Uid=root;Pwd=TU_PASSWORD
Jwt__key=UNA_CLAVE_LARGA_Y_ALEATORIA
Jwt__Issuer=flowtrack.API
Jwt__Audience=flowtrack.Client
Jwt__ExpireMinutes=60
```

> `flowtrack.Api/.env` está en `.gitignore`. Solo se versiona `.env.example`.

### Frontend (`flowtrack-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5106
```

Si usas el perfil HTTPS del backend, confía el certificado (`dotnet dev-certs https --trust`) y
apunta la variable a `https://localhost:7211`.

## API

Todas las rutas (salvo registro y login) requieren `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar usuario y obtener token |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión e invalidar los tokens del usuario |
| `GET` `POST` | `/api/categories` | Listar / crear categorías |
| `GET` `PUT` `DELETE` | `/api/categories/{id}` | Consultar / editar / borrar categoría |
| `GET` `POST` | `/api/paymentmethods` | Listar / crear métodos de pago |
| `GET` `PUT` `DELETE` | `/api/paymentmethods/{id}` | Consultar / editar / borrar método de pago |
| `GET` `POST` | `/api/expenses` | Listar / crear gastos |
| `GET` `PUT` `DELETE` | `/api/expenses/{id}` | Consultar / editar / borrar gasto |
| `GET` `POST` | `/api/budgets` | Listar / crear presupuestos |
| `GET` `PUT` `DELETE` | `/api/budgets/{id}` | Consultar / editar monto / borrar presupuesto |
| `GET` | `/api/budgets/{id}/status` | Estado de un presupuesto |
| `GET` | `/api/budgets/status?month=&year=` | Estado de todos los presupuestos del periodo |
| `POST` | `/api/file/import/expenses` | Importar gastos desde `.xlsx` |
| `POST` | `/api/file/export/report` | Exportar reporte mensual (`Json`, `Txt`, `Excel`) |
| `PUT` | `/api/userprofiles/name` | Actualizar nombre |
| `PUT` | `/api/userprofiles/password` | Cambiar contraseña |

### Contrato de errores

```json
{
  "statusCode": 409,
  "errorType": "DUPLICATE_RESOURCE",
  "message": "El email ya está registrado",
  "errors": null,
  "requestId": "0HN..."
}
```

Valores de `errorType`: `DUPLICATE_RESOURCE`, `RESOURCE_NOT_FOUND`, `INVALID_CREDENTIALS`,
`FORBIDDEN_OPERATION`, `BUSINESS_RULE_VIOLATION`, `INTERNAL_ERROR`.

## Reglas de negocio

- Categorías y métodos de pago: nombre único por usuario.
- No se puede borrar una categoría ni un método de pago con gastos asociados (`403`).
- Gastos: monto mayor que cero, fecha no futura, categoría y método de pago existentes.
- Presupuestos: monto mayor que cero, mes 1–12, año 2000–2100, uno por categoría y periodo.
- El estado del presupuesto solo cuenta gastos del mes y año del presupuesto.
- Importación: hoja 1 del `.xlsx`, columnas **Monto, Fecha, Descripción, Categoría, Método de pago**.
- Los reportes se calculan en el cliente a partir de `GET /api/expenses`; la exportación la genera
  el backend.

## Estructura del proyecto

```
Flowtrack/
├── flowtrack.Api/            # API ASP.NET Core
│   ├── Controllers/
│   ├── Extensions/           # JWT, CORS, .env, manejo de excepciones
│   ├── Middlewares/
│   └── Program.cs
├── flowtrack.BLL/            # Servicios, DTOs, reglas y mapeos
├── flowtrack.DAL/            # EF Core, repositorios, migraciones
├── flowtrack.Entities/       # Entidades del dominio
├── flowtrack-frontend/       # Cliente Next.js
│   ├── app/                  # Rutas (App Router)
│   ├── components/           # UI y componentes de dominio
│   ├── context/              # Sesión
│   ├── hooks/                # Acceso a la API
│   ├── lib/                  # Cliente HTTP, auth, utilidades
│   └── types/                # Tipos del contrato
└── Flowtrack.slnx            # Solución
```

## Notas

- El JWT expira a los 60 minutos (configurable con `Jwt__ExpireMinutes`).
- Cerrar sesión incrementa `User.TokenVersion`: **invalida todos los tokens del usuario** (todos los
  dispositivos). Los tokens emitidos antes de este cambio deben renovarse iniciando sesión.
- CORS está abierto (`AllowAnyOrigin`) para desarrollo; en producción debe restringirse al dominio
  del frontend.
- No se versionan secretos: `.env`, `.env.local`, `node_modules`, `.next`, `bin` y `obj` están ignorados.

## Autor

**Franklin Peguero** — Proyecto de **Programación 3**.
