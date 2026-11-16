# Trabajo Práctico N.º 3 – Control de Vehículos

Universidad Tecnológica Nacional – Facultad Regional La Rioja
Tecnicatura Universitaria en Programación – Programación IV

Aplicación para el control de vehículos, conductores y viajes de una empresa
de transporte. Cada usuario se autentica con JWT y desde el panel se administran
los registros y el historial de kilómetros recorridos.

## Estructura

```
tp3/
├── backend/          API REST con Express.js + MySQL (mysql2)
│   ├── sql/          Definiciones de las tablas (schema.sql)
│   └── src/          Config, rutas, controladores, validaciones y middleware
└── frontend/         SPA con Vite + React (JavaScript) y CSS puro
```

## Requisitos

- Node.js 18+
- MySQL 8+ (o MariaDB)

## Backend

```bash
cd backend
npm install
cp .env.example .env   # configurar credenciales de MySQL y JWT_SECRET
npm run dev            # modo desarrollo (nodemon)
npm start              # modo producción
```

Por defecto el servidor escucha en `http://localhost:3000`.

### Script SQL

Ejecutar `backend/sql/schema.sql` en MySQL para crear la base de datos,
las tablas y datos de prueba.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Configurar `VITE_API_URL` en `.env` si el
backend corre en otro host (por defecto `http://localhost:3000/api`).

## Características principales

- **Autenticación**: registro e inicio de sesión con JWT (expira en 4 horas),
  Passport con estrategia `passport-jwt` para proteger las rutas CRUD.
- **Seguridad**: contraseñas hasheadas con bcrypt, nunca viajan en texto plano.
- **Validaciones**: `express-validator` en todas las rutas (GET, POST, PUT, DELETE)
  y validaciones equivalentes en los formularios de React.
- **Entidades**: Usuario, Vehículo, Conductor y Viaje (con claves foráneas).
- **Reportes**: historial de viajes por vehículo o conductor y total de
  kilómetros recorridos.
- **Pruebas de API**: archivos `.http` en `backend/http/`.
