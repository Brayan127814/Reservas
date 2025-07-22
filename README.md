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