<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router para navegación
const router = useRouter();

// Estado para el sidebar
const sidebarVisible = ref(false);

// Función para navegar a las rutas
const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

// Función para mostrar/ocultar el sidebar móvil
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div class="navbar-container">
    <pv-toolbar class="custom-toolbar p-0">
      <template #start>
        <div class="brand" @click="navigateTo('home')">
          <img src="@/assets/images/logo.jpg" alt="Users" class="brand-logo"/>
          <span class="brand-name">Users Management</span>
        </div>
      </template>

      <template #end>
        <div class="desktop-menu">
          <pv-button
              label="Inicio"
              icon="pi pi-home"
              class="p-button-text nav-item"
              @click="navigateTo('home')"
          />
          <pv-button
              label="Gestión Usuarios"
              icon="pi pi-users"
              class="p-button-text nav-item"
              @click="navigateTo('user')"
          />
        </div>
        <pv-button
            icon="pi pi-bars"
            class="p-button-text mobile-menu-btn"
            @click="toggleSidebar"
            aria-label="Menú"
        />
      </template>
    </pv-toolbar>

    <pv-sidebar v-model:visible="sidebarVisible" position="right" class="mobile-sidebar">
      <div class="sidebar-header">
        <h3>Menú</h3>
      </div>

      <div class="sidebar-user-info">
        <i class="pi pi-user mr-2"></i>
        <span>Barbara</span>
      </div>

      <div class="sidebar-content">
        <div class="mobile-users-group">
          <h4 class="users-group-title">Navegación</h4>
          <ul class="mobile-menu-list">
            <li @click="navigateTo('home'); sidebarVisible = false">
              <i class="pi pi-home mr-2"></i>Home
            </li>
            <li @click="navigateTo('user'); sidebarVisible = false">
              <i class="pi pi-users mr-2"></i>Gestión de Usuarios
            </li>
          </ul>
        </div>
      </div>

      <div class="sidebar-footer">
        <pv-button
            label="Cerrar sesión"
            icon="pi pi-sign-out"
            class="p-button-danger p-button-outlined w-full"
        />
      </div>
    </pv-sidebar>
  </div>
</template>

<style scoped>
.navbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
  background-color: var(--color-card);
}

.custom-toolbar {
  background-color: var(--color-card) !important;
  padding: 0 2rem !important;
  border: none !important;
  height: 70px;
  box-shadow: var(--shadow-sm);
}

.brand {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: var(--transition-normal);
}

.brand:hover {
  transform: scale(1.02);
}

.brand-logo {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  box-shadow: var(--shadow-sm);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  transition: var(--transition-normal);
}

.brand:hover .brand-name {
  color: #D35400;
}

.desktop-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  border-radius: var(--border-radius-md) !important;
  transition: var(--transition-normal) !important;
  color: var(--color-text-primary) !important;
  border: none !important;
  padding: 0.75rem 1rem !important;
  font-weight: 500 !important;
}

.nav-item:hover {
  background-color: var(--color-accent) !important;
  color: var(--color-text-primary) !important;
  transform: translateY(-1px) !important;
  box-shadow: var(--shadow-sm) !important;
}

.nav-item:active {
  transform: translateY(0) !important;
}

.mobile-menu-btn {
  display: none;
  color: var(--color-primary) !important;
  border: none !important;
  background: transparent !important;
  transition: var(--transition-normal) !important;
}

.mobile-menu-btn:hover {
  background-color: var(--color-accent) !important;
  transform: scale(1.1) !important;
}

.mobile-sidebar {
  width: 280px !important;
  display: flex;
  flex-direction: column;
  background-color: var(--color-card) !important;
  border: none !important;
  box-shadow: var(--shadow-lg) !important;
}

.sidebar-header {
  padding: 1.5rem;
  background-color: var(--color-background) !important;
  border: none !important;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar-user-info {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--color-accent);
  font-weight: 600;
  color: var(--color-text-primary);
  transition: var(--transition-normal);
}

.sidebar-user-info:hover {
  background-color: #95C9A3;
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--color-card);
}

.users-group-title {
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.mobile-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu-list li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: var(--transition-normal);
  border-radius: var(--border-radius-sm);
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.mobile-menu-list li:hover {
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  transform: translateX(4px);
}

.mobile-menu-list li i {
  margin-right: 0.75rem;
  color: var(--color-primary);
}

.sidebar-footer {
  padding: 1.5rem;
  background-color: var(--color-background);
  border: none !important;
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .custom-toolbar {
    padding: 0 1rem !important;
    height: 60px;
  }

  .brand-logo {
    height: 32px;
    width: 32px;
  }

  .brand-name {
    font-size: 1.1rem;
  }
}
</style>