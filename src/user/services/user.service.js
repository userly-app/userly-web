import http from "@/shared/services/http-common.js";
import { UserEntity } from "@/user/model/user.entity.js";

export class UserService {
    constructor() {
        this.users = [];
        this.loading = false;
        // Recuperar IDs eliminados de localStorage
        this.deletedUserIds = JSON.parse(localStorage.getItem('deletedUserIds') || '[]');
    }

    // Obtener todos los usuarios
    async getAllUsers() {
        try {
            this.loading = true;
            const response = await http.get('/');
            // Filtrar los usuarios eliminados
            const allUsers = response.data.map(user => UserEntity.fromJson(user));
            this.users = allUsers.filter(user => !this.deletedUserIds.includes(user.id));
            this.loading = false;
            return this.users;
        } catch (error) {
            this.loading = false;
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    // Obtener un usuario por ID
    async getUserById(id) {
        try {
            this.loading = true;

            // Verificar si está en caché local primero
            const cachedUser = this.users.find(user => user.id === id);
            if (cachedUser) {
                this.loading = false;
                return cachedUser;
            }

            // Si no está en caché, obtener de la API
            const response = await http.get(`/${id}`);
            const user = UserEntity.fromJson(response.data);
            this.loading = false;
            return user;
        } catch (error) {
            this.loading = false;
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }

    // Crear un nuevo usuario
    async createUser(userData) {
        try {
            this.loading = true;
            // Enviar a la API (solo simulado en JSONPlaceholder)
            const response = await http.post('/', userData.toJson());

            // Crear entidad desde respuesta
            const newUser = UserEntity.fromJson(response.data);

            // Almacenar localmente
            this.users.push(newUser);
            this.loading = false;
            return newUser;
        } catch (error) {
            this.loading = false;
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // Actualizar un usuario existente
    async updateUser(userData) {
        try {
            this.loading = true;
            // Enviar a la API (solo simulado en JSONPlaceholder)
            const response = await http.put(`/${userData.id}`, userData.toJson());

            // Actualizar en el almacenamiento local
            const updatedUser = UserEntity.fromJson(response.data);
            const index = this.users.findIndex(user => user.id === updatedUser.id);

            if (index !== -1) {
                this.users[index] = updatedUser;
            }

            this.loading = false;
            return updatedUser;
        } catch (error) {
            this.loading = false;
            console.error(`Error al actualizar usuario con ID ${userData.id}:`, error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            this.loading = true;
            await http.delete(`/${id}`);

            // Persistir ID eliminado en localStorage
            if (!this.deletedUserIds.includes(id)) {
                this.deletedUserIds.push(id);
                localStorage.setItem('deletedUserIds', JSON.stringify(this.deletedUserIds));
            }

            this.users = this.users.filter(user => user.id !== id);
            this.loading = false;
            return true;
        } catch (error) {
            this.loading = false;
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
            throw error;
        }
    }

    // Verificar si hay usuarios cargados
    hasUsers() {
        return this.users.length > 0;
    }

    // Obtener estado de carga
    isLoading() {
        return this.loading;
    }
}