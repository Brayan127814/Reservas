
export const todosLosPermisos = (rol: string): boolean => {
    return rol === 'Admin' || rol === 'recepcionista'
}