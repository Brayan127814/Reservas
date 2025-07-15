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

## ⚙️ Funcionalidades
- Registro y login de huéspedes
- Gestión de habitaciones con control de disponibilidad
- Creación, actualización y cancelación de reservas
- Roles y protección de rutas (Guards + Decoradores personalizados)
- Cifrado de contraseñas
- Validación con DTOs y Pipes