<template>
  <div class="main-container">
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Usuarios</h2>
        <div class="action-panel">
          <button class="action-btn restore-btn" @click="restoreDeletedUsers">
            <i class="pi pi-history"></i>
            <span>Restaurar eliminados</span>
          </button>

          <button class="action-btn new-user-btn" @click="showCreateUserDialog">
            <i class="pi pi-user-plus"></i>
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>
      <p class="page-subtitle">Administra a los usuarios registrados en la plataforma.</p>
    </div>

    <div class="data-table-container">
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <h3 class="table-title">Usuarios</h3>
          <span class="table-count">{{ users.length }} usuarios</span>
        </div>
        <div class="search-box">
          <input type="text" v-model="searchQuery" class="search-input" placeholder="Buscar usuarios..." />
          <i class="pi pi-search search-icon"></i>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Cargando usuarios...</p>
      </div>

      <table v-else class="data-table">
        <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr 
          v-for="(user, index) in filteredUsers" 
          :key="user.id"
          :style="{ '--row-index': index }"
          class="table-row-animated"
        >
          <td data-label="Usuario">
            <div class="user-info">
              <div class="user-avatar">{{ getInitials(user.name) }}</div>
              <div class="user-details">
                <h4>{{ user.name }}</h4>
                <p>@{{ user.username }}</p>
              </div>
            </div>
          </td>
          <td data-label="Email">{{ user.email }}</td>
          <td data-label="Teléfono">{{ user.phone }}</td>
          <td data-label="Acciones">
            <div class="action-buttons">
              <pv-button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded"
                  @click="editUser(user)"
                  aria-label="Editar"
              />
              <pv-button
                  icon="pi pi-trash"
                  class="p-button-text p-button-rounded p-button-danger"
                  @click="confirmDelete(user)"
                  aria-label="Eliminar"
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Diálogos Profesionales -->
    <UserFormDialog
      v-model="dialogs.userForm.visible"
      :mode="dialogs.userForm.mode"
      :user="dialogs.userForm.user"
      @submit="handleUserSubmit"
      @cancel="hideUserFormDialog"
      ref="userFormDialogRef"
    />

    <ConfirmDialog
      v-model="dialogs.confirm.visible"
      v-bind="dialogs.confirm.config"
      @confirm="confirmAction"
      @cancel="cancelAction"
      ref="confirmDialogRef"
    />

    <pv-toast />
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserDialogs } from '../../shared/composables/useDialogs.js'
import UserFormDialog from '../../shared/components/UserFormDialog.component.vue'
import ConfirmDialog from '../../shared/components/ConfirmDialog.component.vue'
import { UserService } from '../services/user.service.js'
import { UserEntity } from '../model/user.entity.js'

const users = ref([])
const searchQuery = ref('')
const loading = ref(false)
const toast = useToast()
const userService = new UserService()

// Usar el composable de diálogos
const {
  dialogs,
  confirmDialogRef,
  userFormDialogRef,
  showCreateUserDialog,
  showEditUserDialog,
  confirmDeleteUser,
  hideUserFormDialog,
  confirmAction,
  cancelAction,
  finishConfirmLoading
} = useUserDialogs()

const getUsers = async () => {
  try {
    loading.value = true
    users.value = await userService.getAllUsers()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los usuarios',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(getUsers)

const filteredUsers = computed(() =>
    users.value.filter(user =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
)
const restoreDeletedUsers = async () => {
  try {
    // Usar el método del servicio en lugar de implementar la lógica aquí
    users.value = await userService.restoreDeletedUsers();

    toast.add({
      severity: 'success',
      summary: 'Usuarios restaurados',
      detail: 'Los usuarios eliminados han sido restaurados',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron restaurar los usuarios',
      life: 3000
    });
  }
}

const getInitials = name => name.split(' ').map(n => n[0]).join('').slice(0, 2)

// Manejar envío de formulario de usuario (crear o editar)
const handleUserSubmit = async (userData) => {
  try {
    if (userData.id) {
      // Actualizar usuario existente
      const mergedUser = new UserEntity(
        userData.id,
        userData.name,
        userData.username,
        userData.email,
        userData.phone
      )

      await userService.updateUser(mergedUser)
      users.value = users.value.map(u => u.id === userData.id ? mergedUser : u)

      toast.add({
        severity: 'success',
        summary: 'Usuario actualizado',
        detail: `${userData.name} ha sido actualizado correctamente`,
        life: 3000
      })
    } else {
      // Crear nuevo usuario
      const newUser = await userService.createUser(userData)
      users.value.push(newUser)

      toast.add({
        severity: 'success',
        summary: 'Usuario creado',
        detail: `${userData.name} ha sido añadido correctamente`,
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error al procesar usuario:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: userData.id ? 'No se pudo actualizar el usuario' : 'No se pudo crear el usuario',
      life: 3000
    })
    throw error // Re-lanzar para que el diálogo maneje el error
  }
}

// Editar usuario
const editUser = (user) => {
  showEditUserDialog(user)
}
// Confirmar eliminación de usuario
const confirmDelete = async (user) => {
  try {
    await confirmDeleteUser(user)
    await deleteUser(user.id, user.name)
    finishConfirmLoading()
  } catch (error) {
    if (error.message !== 'Dialog cancelled') {
      console.error('Error al eliminar usuario:', error)
      finishConfirmLoading()
    }
  }
}

const deleteUser = async (id, userName) => {
  try {
    await userService.deleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
    
    toast.add({
      severity: 'success',
      summary: 'Usuario eliminado',
      detail: 'El usuario ha sido eliminado correctamente',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el usuario',
      life: 3000
    })
    throw error
  }
}
</script>

<style scoped>

.main-container {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Nunito Sans', sans-serif !important;
}

.page-header {
  margin-bottom: 2rem;
  font-family: 'Nunito Sans', sans-serif !important;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-family: 'Nunito Sans', sans-serif !important;
}

.page-title h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'Nunito Sans', sans-serif !important;
}

.page-subtitle {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 1rem;
  font-family: 'Nunito Sans', sans-serif !important;
}

.data-table-container {
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: none;
  transition: var(--transition-normal);
}

.data-table-container:hover {
  box-shadow: var(--shadow-md);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

.loading-container i {
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  border: none;
  position: relative;
  overflow: hidden;
}

.table-toolbar::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmer 4s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.table-toolbar-left {
  display: flex;
  flex-direction: column;
}

.table-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.table-count {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  position: relative;
  z-index: 1;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: rgba(255, 255, 255, 0.8);
  z-index: 2;
  transition: all 0.3s ease;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px 8px 0 0;
  width: 300px;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  border-bottom-color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.search-input:focus + .search-icon {
  color: white;
  transform: scale(1.1);
}

.search-input:hover {
  border-bottom-color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.15);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-card);
}

.data-table th {
  text-align: left;
  padding: 1.25rem 2rem;
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 0.875rem;
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(211, 84, 0, 0.05) 100%);
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  transition: all 0.3s ease;
}

.data-table th::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #e67e22, #d35400);
  opacity: 0.3;
}

.data-table td {
  padding: 1.25rem 2rem;
  border: none;
  color: var(--color-text-primary);
  background-color: var(--color-card);
  transition: var(--transition-normal);
}

.data-table tr {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.data-table tbody tr:nth-child(even) {
  background-color: rgba(230, 126, 34, 0.03);
}

.data-table tbody tr:nth-child(odd) {
  background-color: transparent;
}

.data-table tr:hover {
  background-color: rgba(230, 126, 34, 0.08) !important;
  transform: translateY(-2px) scale(1.002);
  box-shadow: 0 8px 25px rgba(230, 126, 34, 0.12);
  z-index: 1;
}

.data-table tr:hover td {
  background-color: transparent;
}

.data-table tr:active {
  transform: translateY(-1px) scale(1.001);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  margin-right: 1rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  animation: subtle-pulse 6s ease-in-out infinite;
}

.user-avatar::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e67e22, #d35400);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-info:hover .user-avatar {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 20px rgba(230, 126, 34, 0.4);
}

.user-info:hover .user-avatar::before {
  opacity: 0.3;
}

@keyframes subtle-pulse {
  0%, 100% { 
    box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3), 0 0 0 0 rgba(230, 126, 34, 0.4);
  }
  50% { 
    box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3), 0 0 0 4px rgba(230, 126, 34, 0.1);
  }
}

.user-details h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-details p {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons .p-button {
  font-family: 'Nunito Sans', sans-serif !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  transition: all 0.2s ease !important;
  border: none !important;
}

.action-buttons .p-button:hover {
  transform: scale(1.1) !important;
}

.action-buttons .p-button:active {
  transform: scale(0.95) !important;
}

/* Botón de editar - azul simple */
.action-buttons .p-button:not(.p-button-danger) {
  background-color: #3498db !important;
}

.action-buttons .p-button:not(.p-button-danger):hover {
  background-color: #2980b9 !important;
}

/* Botón de eliminar - rojo simple */
.action-buttons .p-button.p-button-danger {
  background-color: #e74c3c !important;
}

.action-buttons .p-button.p-button-danger:hover {
  background-color: #c0392b !important;
}

@media (max-width: 992px) {
  .page-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .data-table th:nth-child(3),
  .data-table td:nth-child(3) {
    display: none;
  }

  .data-table th,
  .data-table td {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 640px) {
  .data-table {
    display: block;
  }

  .data-table thead {
    display: none;
  }

  .data-table tbody {
    display: block;
  }

  .data-table tr {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    border-radius: var(--border-radius-md);
    padding: 1rem;
    box-shadow: var(--shadow-sm);
    background-color: var(--color-card) !important;
  }

  .data-table td {
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-accent);
    position: relative;
    text-align: left;
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  .data-table td::before {
    content: attr(data-label);
    font-weight: 600;
    width: 40%;
    color: var(--color-text-secondary);
  }

  .data-table td:first-child {
    border-bottom: 1px solid var(--color-accent);
  }

  .action-buttons {
    margin-top: 0.5rem;
    justify-content: flex-end;
    width: 100%;
  }
}

@media (max-width: 400px) {
  .user-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-avatar {
    margin-bottom: 0.5rem;
    margin-right: 0;
  }
}

.action-panel {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-family: 'Nunito Sans', sans-serif !important;
}

.action-btn {
  font-family: 'Nunito Sans', sans-serif !important;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(-1px);
}

.action-btn i {
  font-size: 1.1rem;
}

.restore-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.new-user-btn {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
}

/* Animación de entrada para las filas */
.table-row-animated {
  animation: fadeInUp 0.6s ease-out;
  animation-delay: calc(var(--row-index) * 0.05s);
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading mejorado */
.loading-container {
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.05) 0%, rgba(211, 84, 0, 0.02) 100%);
  border-radius: 12px;
}

.loading-container i {
  background: linear-gradient(135deg, #e67e22, #d35400);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: loading-pulse 2s ease-in-out infinite;
}

@keyframes loading-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Efecto de focus en la tabla */
.data-table-container:focus-within {
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.2);
}

/* Transición suave para el contenedor de la tabla */
.data-table-container {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.data-table-container:hover {
  box-shadow: 0 8px 30px rgba(230, 126, 34, 0.08);
}

@media (max-width: 768px) {
  .action-panel {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  /* Animación más rápida en mobile */
  .table-row-animated {
    animation-delay: calc(var(--row-index) * 0.03s);
  }
}
</style>