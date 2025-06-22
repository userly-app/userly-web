<script setup>
import {ref, watch, reactive, onMounted} from 'vue'
import {useVuelidate} from '@vuelidate/core'
import {required, email, minLength} from '@vuelidate/validators'
import {UserEntity} from '../model/user.entity.js'

const props = defineProps({
  user: {
    type: Object,
    default: () => new UserEntity()
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  id: null,
  name: '',
  username: '',
  email: '',
  phone: ''
})

const rules = {
  name: {required, minLength: minLength(3)},
  username: {required, minLength: minLength(3)},
  email: {required, email},
  phone: {required}
}

const v$ = useVuelidate(rules, form)

// Load the user data for the edit form
onMounted(() => {
  if (props.user && props.user.id) {
    loadUserData(props.user)
  }
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    loadUserData(newUser)
  }
}, {immediate: true})

function loadUserData(userData) {
  form.id = userData.id || null
  form.name = userData.name || ''
  form.username = userData.username || ''
  form.email = userData.email || ''
  form.phone = userData.phone || ''
}

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (isValid) {
    try {
      const userData = new UserEntity(
          form.id,
          form.name,
          form.username,
          form.email,
          form.phone
      )

      emit('submit', userData)

      v$.value.$reset()
      if (!form.id) {
        form.name = ''
        form.username = ''
        form.email = ''
        form.phone = ''
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
    }
  }
}


</script>

<template>
  <form @submit.prevent="handleSubmit" class="user-form">
    <div class="form-grid">
      <div class="form-group">
        <div class="label-with-icon">
          <i class="pi pi-user label-icon"></i>
          <label class="form-label" for="name">Nombre</label>
        </div>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-user"></i>
          <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-input w-full"
              :class="{ 'p-invalid': v$.name.$error }"
              required
          />
        </span>
        <small v-if="v$.name.$error" class="p-error">{{ v$.name.$errors[0].$message }}</small>
      </div>

      <div class="form-group">
        <div class="label-with-icon">
          <i class="pi pi-id-card label-icon"></i>
          <label class="form-label" for="username">Usuario</label>
        </div>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-id-card"></i>
          <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-input w-full"
              :class="{ 'p-invalid': v$.username.$error }"
              required
          />
        </span>
        <small v-if="v$.username.$error" class="p-error">{{ v$.username.$errors[0].$message }}</small>
      </div>

      <div class="form-group full-width">
        <div class="label-with-icon">
          <i class="pi pi-envelope label-icon"></i>
          <label class="form-label" for="email">Email</label>
        </div>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-envelope"></i>
          <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input w-full"
              :class="{ 'p-invalid': v$.email.$error }"
              required
          />
        </span>
        <small v-if="v$.email.$error" class="p-error">{{ v$.email.$errors[0].$message }}</small>
      </div>

      <div class="form-group full-width">
        <div class="label-with-icon">
          <i class="pi pi-phone label-icon"></i>
          <label class="form-label" for="phone">Teléfono</label>
        </div>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-phone"></i>
          <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="form-input w-full"
              :class="{ 'p-invalid': v$.phone.$error }"
              required
          />
        </span>
        <small v-if="v$.phone.$error" class="p-error">{{ v$.phone.$errors[0].$message }}</small>
      </div>
    </div>

    <div class="modal-footer">
      <pv-button
          label="Cancelar"
          class="p-button-danger"
          icon="pi pi-times"
          @click="$emit('cancel')"
      />
      <pv-button
          type="submit"
          label="Guardar"
          icon="pi pi-check"
          class="p-button-success"
      />
    </div>
  </form>
</template>

<style scoped>
.label-with-icon {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.label-icon {
  color: var(--color-primary);
  margin-right: 0.5rem;
  font-size: 1rem;
  transition: var(--transition-normal);
}

.label-with-icon:hover .label-icon {
  transform: scale(1.1);
}

.user-form {
  padding: 2rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: none;
  border-bottom: 2px solid var(--color-accent);
  border-radius: 0;
  background-color: transparent;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  transition: var(--transition-normal);
  position: relative;
}

.form-input:focus {
  outline: none;
  border-bottom-color: var(--color-primary);
  box-shadow: none;
  background-color: rgba(230, 126, 34, 0.02);
}

.form-input:hover {
  border-bottom-color: var(--color-primary);
}

.form-input.p-invalid {
  border-bottom-color: var(--color-danger);
  background-color: rgba(231, 76, 60, 0.02);
}

.form-input::placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

.p-input-icon-left {
  position: relative;
  display: block;
}

.p-input-icon-left i:first-child {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  z-index: 1;
  transition: var(--transition-normal);
}

.form-input:focus + i,
.form-input:focus ~ i {
  color: var(--color-primary);
}

.p-error {
  color: var(--color-danger);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.p-error::before {
  content: "⚠";
  font-size: 0.7rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-accent);
}

.modal-footer .p-button {
  min-width: 120px;
  transition: var(--transition-normal);
}

.modal-footer .p-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .user-form {
    padding: 1.5rem 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-footer .p-button {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .form-input {
    padding: 0.75rem 1rem 0.75rem 2.25rem;
    font-size: 0.9rem;
  }

  .form-label {
    font-size: 0.85rem;
  }
}
</style>