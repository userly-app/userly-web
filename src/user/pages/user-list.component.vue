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

          <button class="action-btn new-user-btn" @click="showAddDialog = true">
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
          <i class="pi pi-search search-icon"></i>
          <input type="text" v-model="searchQuery" class="search-input" placeholder="Buscar usuarios..." />
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
        <tr v-for="user in filteredUsers" :key="user.id">
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

    <!-- Dialogs -->
    <pv-dialog header="Nuevo Usuario" v-model:visible="showAddDialog" :modal="true">
      <CreateUserModal @submit="addUser" @cancel="showAddDialog = false" />
    </pv-dialog>

    <pv-dialog header="Editar Usuario" v-model:visible="showEditDialog" :modal="true">
      <CreateUserModal :user="selectedUser" @submit="updateUser" @cancel="showEditDialog = false" />
    </pv-dialog>

    <pv-confirm-dialog />
    <pv-toast />
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import CreateUserModal from '../components/create-user-modal.component.vue'
import { UserService } from '../services/user.service.js'
import { UserEntity } from '../model/user.entity.js'

const users = ref([])
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const selectedUser = ref(null)
const loading = ref(false)
const confirm = useConfirm()
const toast = useToast()
const userService = new UserService()

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

const addUser = async (userData) => {
  try {
    loading.value = true
    const newUser = await userService.createUser(userData)
    users.value.push(newUser)
    showAddDialog.value = false
    toast.add({
      severity: 'success',
      summary: 'Usuario creado',
      detail: `${userData.name} ha sido añadido correctamente`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo añadir el usuario',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const editUser = user => {
  selectedUser.value = { ...user }
  showEditDialog.value = true
}
const updateUser = async (updated) => {
  try {
    loading.value = true

    // Crear una nueva instancia con los datos actualizados
    const mergedUser = new UserEntity(
        updated.id,
        updated.name,
        updated.username,
        updated.email,
        updated.phone
    )

    await userService.updateUser(mergedUser)

    // Actualizar la lista local usando map para crear un nuevo array
    users.value = users.value.map(u => u.id === updated.id ? mergedUser : u)

    showEditDialog.value = false
    toast.add({
      severity: 'success',
      summary: 'Usuario actualizado',
      detail: `${updated.name} ha sido actualizado correctamente`,
      life: 3000
    })
  } catch (error) {
    console.error('Error al actualizar:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar el usuario',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
const confirmDelete = user => {
  confirm.require({
    message: `¿Estás seguro que deseas eliminar a ${user.name}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteUser(user.id),
    reject: () => {}
  })
}

const deleteUser = async (id) => {
  try {
    loading.value = true
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
  } finally {
    loading.value = false
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
  background-color: #b0b0b0;
  border: none;
}

.table-toolbar-left {
  display: flex;
  flex-direction: column;
}

.table-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
}

.table-count {
  color: #000000;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #000000;
  z-index: 1;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: none;
  border-bottom: 2px solid var(--color-accent);
  border-radius: 0;
  width: 300px;
  font-size: 0.9rem;
  background-color: transparent;
  color: #000000;
 transition: var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-bottom-color: black;
  box-shadow: none;
}

.search-input:hover {
  border-bottom-color: black;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-card);
}

.data-table th {
  text-align: left;
  padding: 1.25rem 2rem;
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.875rem;
  background-color: var(--color-background-alt);
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 1.25rem 2rem;
  border: none;
  color: var(--color-text-primary);
  background-color: var(--color-card);
  transition: var(--transition-normal);
}

.data-table tr {
  transition: var(--transition-normal);
}

.data-table tr:hover {
  background-color: var(--color-background) !important;
  transform: scale(1.01);
}

.data-table tr:hover td {
  background-color: var(--color-background);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin-right: 1rem;
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.user-info:hover .user-avatar {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
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
  transition: var(--transition-normal) !important;
}

.action-buttons .p-button:hover {
  transform: scale(1.1) !important;
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

@media (max-width: 768px) {
  .action-panel {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>