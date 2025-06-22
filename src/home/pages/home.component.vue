<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>Bienvenido al Sistema de Gestión de Usuarios</h1>
      <p class="subtitle">Administra fácilmente todos los usuarios registrados en la plataforma</p>
    </div>

    <div class="dashboard-cards">
      <div class="card dashboard-card">
        <div class="card-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="card-content">
          <h3>Gestión de Usuarios</h3>
          <p>Administra perfiles, roles y permisos de tus usuarios</p>
          <pv-button label="Ir a Usuarios" class="p-button-primary mt-3" @click="$router.push({name: 'user'})"/>
        </div>
      </div>

      <!--Simulation of methods-->
      <div class="card dashboard-card">
        <div class="card-icon">
          <i class="pi pi-chart-bar"></i>
        </div>
        <div class="card-content">
          <h3>Estadísticas</h3>
          <p>Visualiza estadísticas y reportes de actividad</p>
          <pv-button label="Ver Estadísticas" class="p-button-primary mt-3"/>
        </div>
      </div>

      <div class="card dashboard-card">
        <div class="card-icon">
          <i class="pi pi-cog"></i>
        </div>
        <div class="card-content">
          <h3>Configuración</h3>
          <p>Personaliza las preferencias del sistema</p>
          <pv-button label="Configurar" class="p-button-primary mt-3"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  min-height: 100vh;
  background-color: var(--color-background);
}

.welcome-section {
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
}

.welcome-section h1 {
  color: var(--color-text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-card {
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none;
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transform: scaleX(0);
  transition: var(--transition-normal);
}

.dashboard-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.dashboard-card:hover::before {
  transform: scaleX(1);
}

.card-icon {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  width: 70px;
  height: 70px;
  border-radius: var(--border-radius-md);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.dashboard-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: var(--shadow-md);
}

.card-icon i {
  font-size: 2rem;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  color: var(--color-text-primary);
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.card-content p {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  flex: 1;
}

.mt-3 {
  margin-top: 1.5rem;
}

/* Botones personalizados para las cards */
.dashboard-card .p-button {
  transition: var(--transition-normal);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
}

.dashboard-card .p-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 1200px) {
  .dashboard-cards {
    gap: 1.5rem;
    padding: 0 1rem;
  }
}

@media (max-width: 992px) {
  .dashboard-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .welcome-section {
    margin-bottom: 3rem;
    padding: 2rem 0;
  }

  .welcome-section h1 {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1.5rem;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .dashboard-card {
    padding: 1.5rem;
  }

  .card-icon {
    width: 60px;
    height: 60px;
  }

  .card-icon i {
    font-size: 1.75rem;
  }

  .card-content h3 {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .home-container {
    padding: 1rem;
  }

  .dashboard-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .welcome-section {
    margin-bottom: 2rem;
    padding: 1.5rem 0;
  }

  .welcome-section h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .dashboard-card {
    padding: 1.25rem;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;
  }

  .card-icon i {
    font-size: 1.5rem;
  }

  .card-content h3 {
    font-size: 1.2rem;
  }
}
</style>