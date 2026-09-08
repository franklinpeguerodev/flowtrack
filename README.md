# FlowTrack

**FlowTrack** es una aplicación web full-stack para la gestión de finanzas personales que permite a los usuarios registrar sus gastos, organizarlos por categorías y métodos de pago, definir presupuestos con alertas automáticas, e importar/exportar información en distintos formatos de archivo.

Este proyecto fue desarrollado como **proyecto final de la asignatura Programación 2**, con el objetivo de aplicar en un caso de uso real los conceptos de arquitectura en capas, persistencia de datos, autenticación segura y desarrollo de una API RESTful consumida por un frontend moderno.

---

## Tabla de contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Configuración](#configuración)
- [Autor](#autor)

---

## Características

- 🔐 **Autenticación y autorización** con JWT (registro e inicio de sesión).
- 💸 **Gestión de gastos**: creación, edición, eliminación y consulta de gastos personales.
- 🏷️ **Categorías** personalizables para clasificar los gastos.
- 💳 **Métodos de pago** configurables por el usuario.
- 📊 **Presupuestos (budgets)** con seguimiento de estado y niveles de alerta (`Normal`, `Warning50`, `Warning80`, `Exceeded`).
- 📥 **Importación de gastos** desde archivos Excel.
- 📤 **Exportación de reportes** en múltiples formatos: `JSON`, `TXT` y `Excel`.
- 👤 **Gestión de perfil de usuario** (cambio de nombre y contraseña).
- 🖥️ **Dashboard web** con vistas dedicadas para gastos, presupuestos, métodos de pago, reportes y archivos.

## Arquitectura

El backend está construido siguiendo una **arquitectura en capas (layered architecture)**, separando responsabilidades en tres proyectos independientes dentro de la solución .NET:

```
flowtrack.Api       → Capa de presentación (Controllers, middlewares, configuración de la app)
flowtrack.BLL       → Capa de lógica de negocio (Services, DTOs, mapeos, validaciones, excepciones)
flowtrack.DAL       → Capa de acceso a datos (DbContext, repositorios, migraciones, configuraciones EF Core)
flowtrack.Entities  → Entidades de dominio compartidas por las demás capas
```

Esta separación permite bajo acoplamiento entre capas, facilita las pruebas y mantiene la lógica de negocio independiente del framework de persistencia. La inyección de dependencias se registra de forma modular mediante métodos de extensión (`AddDataAccessLayer`, `AddBusinessLogicLayer`) invocados desde `Program.cs`.

El frontend es una aplicación **Next.js (App Router)** independiente que consume la API a través de peticiones HTTP autenticadas con el token JWT.

## Tecnologías utilizadas

### Backend

- **.NET 10** / ASP.NET Core Web API
- **Entity Framework Core** (con MySQL como motor de base de datos)
- **JWT Bearer Authentication** para autenticación de usuarios
- **ClosedXML** para lectura y escritura de archivos Excel (importación/exportación)
- **Scalar** como interfaz interactiva de documentación de la API (OpenAPI)
- Manejo centralizado de excepciones mediante middleware personalizado

### Frontend

- **Next.js 16** (React 19) con App Router
- **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** para el sistema de componentes
- **Recharts** para visualización de datos y gráficos
- **lucide-react** para iconografía

## Estructura del proyecto

```
flowtrack-main/
├── flowtrack.Api/            # API REST (controllers, middlewares, Program.cs)
│   ├── Controllers/
│   ├── Models/Response/       # Modelos de respuesta de la API
│   ├── Middlewares/
│   └── Extensions/
├── flowtrack.BLL/             # Lógica de negocio
│   ├── Services/
│   ├── Services/Export/       # Exportadores (Excel, Json, Txt)
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Mappings/
│   ├── Helpers/
│   ├── Enums/
│   └── Exceptions/
├── flowtrack.DAL/              # Acceso a datos
│   ├── context/                # AppDbContext
│   ├── repositories/
│   ├── interfaces/
│   ├── configurations/         # Configuraciones EF Core por entidad
│   └── Migrations/
├── flowtrack.Entities/          # Entidades de dominio (User, Category, Budget, Expense, PaymentMethod)
└── flowtrack-frontend/         # Aplicación cliente (Next.js)
    └── app/
        ├── login/
        ├── register/
        └── dashboard/
            ├── expenses/
            ├── budgets/
            ├── payment-methods/
            ├── reports/
            └── files/
```

## Endpoints de la API

| Recurso | Endpoints principales |
|---|---|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login` |
| **Expenses** | `GET/POST /api/expenses`, `GET/PUT/DELETE /api/expenses/{id}` |
| **Categories** | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/{id}` |
| **Budgets** | `GET/POST /api/budgets`, `GET/PUT/DELETE /api/budgets/{id}`, `GET /api/budgets/status`, `GET /api/budgets/{id}/status` |
| **Payment Methods** | `GET/POST /api/paymentmethods`, `GET/PUT/DELETE /api/paymentmethods/{id}` |
| **User Profile** | `PUT /api/userprofiles/name`, `PUT /api/userprofiles/password` |
| **Files** | `POST /api/file/import/expenses`, `POST /api/file/export/report` |

Todos los endpoints (salvo `auth`) requieren autenticación mediante token JWT en el header `Authorization: Bearer {token}`.

Con el proyecto corriendo en modo desarrollo, la documentación interactiva de la API está disponible a través de **Scalar**.

## Instalación y ejecución

### Requisitos previos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- Servidor MySQL en ejecución

### Backend

```bash
cd flowtrack.Api
dotnet restore
dotnet ef database update   # aplica las migraciones a la base de datos
dotnet run
```

### Frontend

```bash
cd flowtrack-frontend
npm install
npm run dev
```

La aplicación web quedará disponible en `http://localhost:3000` y la API en el puerto configurado por el proyecto `flowtrack.Api`.

## Configuración

Antes de ejecutar el backend, es necesario editar el archivo `flowtrack.Api/appsettings.json` con los valores propios del entorno:

```json
{
  "ConnectionStrings": {
    "Default": "server=localhost;port=3306;database=api;Uid=root;Pwd=TU_PASSWORD"
  },
  "Jwt": {
    "key": "TU_CLAVE_SECRETA",
    "Issuer": "flowtrack.API",
    "Audience": "flowtrack.Client",
    "ExpireMinutes": "60"
  }
}
```

> ⚠️ No se debe utilizar en producción la clave JWT ni las credenciales de ejemplo incluidas en el repositorio.

> **Nota:** el proyecto puede presentar algunos errores menores, pero su funcionamiento general está bien.

## Autor

**Franklin Junior Peguero Perez**

Proyecto desarrollado como **trabajo final de la asignatura Programación 2**.
