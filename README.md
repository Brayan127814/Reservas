## 📝 Sistema de Reservas - API RESTful con NestJS
API desarrollada con NestJS y TypeScript para gestionar reservas de habitaciones, usuarios y autenticación con JWT. Este sistema permite registrar huéspedes, asignar habitaciones, proteger rutas según el rol del usuario (admin, recepcionista, etc.) y controlar el estado de cada reserva.

---

## 🚀Tecnologías usadas
- NestJS
- TypeScript
- MySQL
- TypeORM
- JWT + Passport
- Bcrypt

---

## ⚙️ Funcionalidades principales

- ✅ Registro y login de huéspedes
- ✅ Autenticación con JWT y cifrado de contraseñas
- ✅ Gestión de habitaciones (crear, listar, cambiar estado)
- ✅ Crear, actualizar y cancelar reservas
- ✅ Visualizar reservas del usuario autenticado
- ✅ Protección de rutas con roles (admin, recepcionista)
- ✅ Validación con DTOs y Pipes
- ✅ Automatización de tareas con `@Cron` para liberar habitaciones expiradas



---

## 🧪 Endpoints principales

| Método | Ruta                     | Descripción                            |
|--------|--------------------------|----------------------------------------|
| POST   | `/auth/login`            | Inicio de sesión y obtención de token  |
| GET    | `/huespedes`             | Obtener huéspedes                      |
| POST   | `/reservas/`              | Crear nueva reserva (autenticado)      |
| GET    | `/reservas`              | Ver reservas del usuario autenticado   |
| PATCH  | `/reservas/:id`          | Modificar fechas de una reserva        |
| DELETE | `/reservas/:id`          | Cancelar reserva         



---


## Autenticación
- Todas las rutas protegidas requieren un token JWT.
- El token debe enviarse en el header como: Authorization: Bearer <token>

---
## ✅ Registro y login de huéspedes
- Registro de un huesped
**Endpoint: http://localhost:4000/huesped/addHuesped**
POST `/huesped`

```json
{
 "nombre":"Daniel de jesus",
 "apellido":"Castillo Ayala",
 "correo":"daniel@gmail.com",
 "contraseña":"12345",
 "rol": 1
}
```
## Inicio de sesión
**Endpoint: http://localhost:4000/auth/login**
POST `/auth`

```json
{

 "correo":"daniel@gmail.com",
 "contraseña":"12345"
 
}
```
---


## Respuesta de inicio de sesíon

```json
{
    "message": "Exit",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImNvcnJlbyI6ImRhbmllbEBnbWFpbC5jb20iLCJyb2wiOiJBZG1pbiIsImlhdCI6MTc1MzM4NTgwNywiZXhwIjoxNzUzMzg5NDA3fQ.lPDYu7vrqSSmo0nO7SjDOuh0RNdHTKDqfP3gHW46oQw",
    "success": true
}
  
  