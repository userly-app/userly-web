# 👥 Sistema de Gestión de Usuarios - Vue.js

Una aplicación web moderna desarrollada en **Vue.js 3** que implementa un sistema CRUD completo para la gestión de usuarios, consumiendo la API pública de JSONPlaceholder con una interfaz elegante y transiciones profesionales.

## 🎯 Objetivo

Desarrollar una aplicación web que permita gestionar usuarios de forma completa (Crear, Leer, Actualizar, Eliminar) utilizando Vue.js 3 con Composition API, consumiendo datos de la API pública `https://jsonplaceholder.typicode.com/users` y almacenándolos localmente para las operaciones CRUD.

## ⚡ Tecnologías Utilizadas

- **Vue.js 3** - Framework JavaScript con Composition API
- **Vite** - Herramienta de build y desarrollo
- **PrimeVue** - Librería de componentes UI
- **Vuelidate** - Validación de formularios
- **CSS3** - Estilos personalizados con transiciones profesionales
- **JSONPlaceholder API** - API REST para datos de usuarios

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Pasos de instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio
cd untitled

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto disponible siguiente).

## 📁 Estructura del Proyecto

```
src/
├── assets/                    # Recursos estáticos (CSS, imágenes)
│   ├── main.css              # Estilos principales y variables CSS
│   └── styles/               # Estilos organizados por componentes
├── shared/                   # Componentes reutilizables
│   ├── components/           # Componentes compartidos
│   └── services/             # Servicios HTTP comunes
├── user/                     # Módulo de usuarios
│   ├── components/           # Componentes específicos de usuarios
│   │   └── create-user-modal.component.vue  # Formulario de usuario
│   ├── model/                # Entidades y modelos de datos
│   │   ├── user.entity.js    # Modelo de usuario
│   ├── pages/                # Páginas principales
│   │   └── user-list.component.vue  # Lista principal de usuarios
│   └── services/             # Servicios específicos de usuarios
│       └── user.service.js   # Servicio API de usuarios
├── router/                   # Configuración de rutas
│   └── index.js              # Definición de rutas
└── main.js                   # Punto de entrada de la aplicación
```

## ✨ Funcionalidades Implementadas

### 1. 📋 Listado de Usuarios
- **Tabla responsiva** con datos: nombre, username, email, teléfono
- **Indicador de carga** durante la obtención de datos
- **Búsqueda en tiempo real** por nombre de usuario
- **Paleta de colores profesional** con transiciones suaves
- **Animaciones de entrada** escalonadas para las filas

### 2. ➕ Agregar Usuario
- **Formulario modal** con validaciones en tiempo real
- **Campos requeridos**: Nombre, Username, Email, Teléfono
- **Validación de email** formato válido
- **Generación automática de ID** siguiendo secuencia
- **Almacenamiento local** (no envío a API)

### 3. ✏️ Editar Usuario
- **Formulario pre-poblado** con datos actuales
- **Actualización en array local** por ID
- **Mismo modal reutilizable** para crear/editar
- **Validaciones consistentes** con creación

### 4. 🗑️ Eliminar Usuario
- **Diálogo de confirmación** antes de eliminar
- **Eliminación del array local** tras confirmación
- **Feedback visual** con notificaciones toast
- **Prevención de eliminaciones accidentales**

### 5. 🎨 Estados Vacíos Profesionales
- **Sin usuarios registrados**: Call-to-action para agregar primer usuario
- **Sin resultados de búsqueda**: Opción para limpiar filtros
- **Transiciones suaves** entre estados
- **Diseño cohesivo** con la paleta principal

## 🛠️ Implementación Técnica

### Arquitectura
- **Composition API**: Lógica reactiva moderna y reutilizable
- **Estructura modular**: Separación clara de responsabilidades
- **Componentes reutilizables**: EmptyState, formularios, diálogos
- **Gestión de estado local**: Array reactivo para operaciones CRUD

### Validaciones
```javascript
// Ejemplo de validaciones con Vuelidate
const rules = {
  name: { required, minLength: minLength(3) },
  username: { required, minLength: minLength(3) },
  email: { required, email },
  phone: { required }
}
```

### Servicios HTTP
```javascript
// UserService para interacciones con API
export class UserService {
  async getAllUsers() { /* GET /users */ }
  async createUser(user) { /* Local storage */ }
  async updateUser(user) { /* Local update */ }
  async deleteUser(id) { /* Local removal */ }
}
```

### Gestión de Estados
```javascript
// Estados reactivos para UX
const showNoUsersState = computed(() => !loading.value && !hasUsers.value)
const showNoResultsState = computed(() => /* lógica de búsqueda vacía */)
const showUserTable = computed(() => /* lógica de tabla visible */)
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: `#e67e22` (Naranja profesional)
- **Secundario**: `#d35400` (Naranjo oscuro)
- **Fondos**: Gradientes sutiles con transparencias
- **Textos**: Escala de grises con buena legibilidad

### Transiciones
- **Vue Transitions**: Componente nativo para cambios de estado
- **CSS Keyframes**: Animaciones personalizadas (pulse, fade, scale)
- **Timing**: `cubic-bezier(0.25, 0.8, 0.25, 1)` para naturalidad
- **Responsive**: Adaptación automática mobile/desktop

### Responsive Design
- **Desktop**: Tabla completa con hover effects
- **Tablet**: Adaptación de tamaños y espaciados
- **Mobile**: Vista de cards con navegación táctil optimizada

## 📊 Modelo de Datos

```javascript
// UserEntity - Estructura principal
{
  id: Number,          // Auto-generado secuencial
  name: String,        // Nombre completo (requerido)
  username: String,    // Nombre de usuario (requerido)
  email: String,       // Email válido (requerido)
  phone: String,       // Teléfono (requerido)
  website: String,     // Opcional
  address: {           // Dirección completa
    street: String,
    suite: String,
    city: String,
    zipcode: String,
    geo: { lat: String, lng: String }
  },
  company: {           // Información empresarial
    name: String,
    catchPhrase: String,
    bs: String
  }
}
```

## 🔧 Configuración del Proyecto

### Variables CSS Principales
```css
:root {
  --color-primary: #e67e22;
  --color-secondary: #d35400;
  --color-background: #ffffff;
  --color-card: #fafafa;
  --transition-normal: all 0.3s ease;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
}
```

**Desarrollado con mucho corazoncito usando Vue.js y las mejores prácticas de desarrollo frontend moderno.**
