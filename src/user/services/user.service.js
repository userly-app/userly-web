import http from "@/shared/services/http-common.js";
import { UserEntity } from "@/user/model/user.entity.js";


class LocalStorageService {
    static getItem(key, defaultValue = []) {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
    }

    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }
}

export class UserService {
    constructor() {
        this.users = [];
        this.loading = false;

        this.STORAGE_KEYS = {
            DELETED_USERS: 'deletedUserIds',
            ADDED_USERS: 'addedUsers',
            UPDATED_USERS: 'updatedUsers',
            LAST_USER_ID: 'lastUserId'
        };

        this.deletedUserIds = LocalStorageService.getItem(this.STORAGE_KEYS.DELETED_USERS);
        this.addedUsers = LocalStorageService.getItem(this.STORAGE_KEYS.ADDED_USERS);
        this.updatedUsers = LocalStorageService.getItem(this.STORAGE_KEYS.UPDATED_USERS);
        this.lastId = parseInt(localStorage.getItem(this.STORAGE_KEYS.LAST_USER_ID) || '10');
    }

    /**
     * The private method to save data to localStorage.
     */
    _saveToLocalStorage(key, data) {
        LocalStorageService.setItem(key, data);
    }

    _isLocalUser(userId) {
        return userId > 10;
    }

    _applyLocalUpdates(apiUsers) {
        let filteredUsers = apiUsers.filter(user => !this.deletedUserIds.includes(user.id));

        filteredUsers = filteredUsers.map(user => {
            const updatedUser = this.updatedUsers.find(u => u.id === user.id);
            return updatedUser ? UserEntity.fromJson(updatedUser) : user;
        });

        const addedUsersEntities = this.addedUsers.map(user => UserEntity.fromJson(user));
        return [...filteredUsers, ...addedUsersEntities];
    }

    async getAllUsers() {
        try {
            this.loading = true;
            const response = await http.get('/');

            /*
            *  Here we convert the API response to UserEntity instances.
            * */
            const apiUsers = response.data.map(user => UserEntity.fromJson(user));

            this.users = this._applyLocalUpdates(apiUsers);

            return this.users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw new Error(`No se pudieron cargar los usuarios: ${error.message}`);
        } finally {
            this.loading = false;
        }
    }

    async createUser(userData) {
        if (!userData || !userData.name || !userData.email) {
            throw new Error('Datos de usuario incompletos');
        }

        try {
            this.loading = true;

            await http.post('/', userData.toJson());

            this.lastId++;
            localStorage.setItem(this.STORAGE_KEYS.LAST_USER_ID, this.lastId.toString());

            const newUser = new UserEntity(
                this.lastId,
                userData.name,
                userData.username,
                userData.email,
                userData.phone
            );

            this.addedUsers.push(newUser.toJson());
            this._saveToLocalStorage(this.STORAGE_KEYS.ADDED_USERS, this.addedUsers);

            /**
             * Here we add the new user to the in-memory users array.
             * */
            this.users.push(newUser);

            return newUser;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw new Error(`No se pudo crear el usuario: ${error.message}`);
        } finally {
            this.loading = false;
        }
    }

    async updateUser(userData) {
        if (!userData || !userData.id) {
            throw new Error('ID de usuario requerido para actualizar');
        }

        try {
            this.loading = true;
            const isLocalUser = this._isLocalUser(userData.id);

            /**
             * In this section, we check if the user is local or from the API.
             * */
            if (!isLocalUser) {
                await http.put(`/${userData.id}`, userData.toJson());
            }

            if (isLocalUser) {
                this._updateLocalUser(userData);
            } else {
                this._updateApiUser(userData);
            }

            const index = this.users.findIndex(user => user.id === userData.id);
            if (index !== -1) {
                this.users[index] = userData;
            }

            return userData;
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${userData.id}:`, error);
            throw new Error(`No se pudo actualizar el usuario: ${error.message}`);
        } finally {
            this.loading = false;
        }
    }

    _updateLocalUser(userData) {
        const index = this.addedUsers.findIndex(u => u.id === userData.id);
        if (index !== -1) {
            this.addedUsers[index] = userData.toJson();
            this._saveToLocalStorage(this.STORAGE_KEYS.ADDED_USERS, this.addedUsers);
        }
    }

    _updateApiUser(userData) {
        const index = this.updatedUsers.findIndex(u => u.id === userData.id);
        if (index !== -1) {
            this.updatedUsers[index] = userData.toJson();
        } else {
            this.updatedUsers.push(userData.toJson());
        }
        this._saveToLocalStorage(this.STORAGE_KEYS.UPDATED_USERS, this.updatedUsers);
    }

    async deleteUser(id) {
        if (!id) {
            throw new Error('ID de usuario requerido para eliminar');
        }

        try {
            this.loading = true;

            await http.delete(`/${id}`);

            /**
             * We check if the user is local or from the API.
             * */
            if (this._isLocalUser(id)) {
                const index = this.addedUsers.findIndex(u => u.id === id);
                if (index !== -1) {
                    this.addedUsers.splice(index, 1);
                    this._saveToLocalStorage(this.STORAGE_KEYS.ADDED_USERS, this.addedUsers);
                }
            } else {
                if (!this.deletedUserIds.includes(id)) {
                    this.deletedUserIds.push(id);
                    this._saveToLocalStorage(this.STORAGE_KEYS.DELETED_USERS, this.deletedUserIds);
                }

                const updatedIndex = this.updatedUsers.findIndex(u => u.id === id);
                if (updatedIndex !== -1) {
                    this.updatedUsers.splice(updatedIndex, 1);
                    this._saveToLocalStorage(this.STORAGE_KEYS.UPDATED_USERS, this.updatedUsers);
                }
            }

            this.users = this.users.filter(user => user.id !== id);

            return true;
        } catch (error) {
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
        } finally {
            this.loading = false;
        }
    }

    async restoreDeletedUsers() {
        try {
            LocalStorageService.removeItem(this.STORAGE_KEYS.DELETED_USERS);
            LocalStorageService.removeItem(this.STORAGE_KEYS.UPDATED_USERS);
            this.deletedUserIds = [];
            this.updatedUsers = [];
            return await this.getAllUsers();
        } catch (error) {
            console.error('Error al restaurar usuarios:', error);
        }
    }
}