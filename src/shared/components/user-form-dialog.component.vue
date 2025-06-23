<template>
  <BaseDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :icon="dialogIcon"
    size="large"
    :close-on-backdrop="!isLoading"
    :close-on-escape="!isLoading"
    @close="handleCancel"
  >

    <div class="form-container" :class="{ 'form-disabled': isLoading }">
      <CreateUserModal
        :user="user"
        @submit="handleSubmit"
        @cancel="handleCancel"
        ref="userFormRef"
      />
    </div>


  </BaseDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseDialog from './base-dialog.component.vue'
import CreateUserModal from '../../user/components/create-user-modal.component.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'success'])

const userFormRef = ref(null)
const isLoading = ref(false)
const showSuccess = ref(false)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditMode = computed(() => props.mode === 'edit' || (props.user && props.user.id))

const dialogTitle = computed(() => {
  return isEditMode.value ? 'Editar Usuario' : 'Crear Nuevo Usuario'
})

const dialogIcon = computed(() => {
  return isEditMode.value ? 'pi pi-user-edit' : 'pi pi-user-plus'
})

const loadingText = computed(() => {
  return isEditMode.value ? 'Actualizando usuario...' : 'Creando usuario...'
})

const successMessage = computed(() => {
  return isEditMode.value ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente'
})

const handleSubmit = async (userData) => {
  isLoading.value = true
  
  try {
    await emit('submit', userData)
    
    showSuccess.value = true
    
    setTimeout(() => {
      showSuccess.value = false
      isLoading.value = false
      emit('update:modelValue', false)
      emit('success', userData)
    }, 1500)
    
  } catch (error) {
    console.error('Error submitting form:', error)
    isLoading.value = false
  }
}

const handleCancel = () => {
  if (!isLoading.value) {
    emit('cancel')
    emit('update:modelValue', false)
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    isLoading.value = false
    showSuccess.value = false
  }
})

const setLoading = (loading) => {
  isLoading.value = loading
}

const showSuccessAnimation = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    emit('update:modelValue', false)
  }, 1500)
}

// Expose methods for parent components
defineExpose({
  setLoading,
  showSuccessAnimation
})
</script>

<style scoped>
.form-container {
  position: relative;
  transition: all 0.3s ease;
}

.form-disabled {
  pointer-events: none;
  opacity: 0.7;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #d35400));
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  animation: pulse-loading 2s infinite;
}

.loading-text {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-primary);
  font-weight: 600;
}

@keyframes pulse-loading {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(230, 126, 34, 0.1);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(230, 126, 34, 0);
  }
}

/* Success Overlay */
.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.95), rgba(39, 174, 96, 0.95));
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 12px;
}

.success-content {
  text-align: center;
  color: white;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto 1.5rem auto;
  font-size: 2.5rem;
  animation: success-bounce 0.6s ease-out;
}

.success-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Nunito Sans', sans-serif;
}

.success-message {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.9;
}

@keyframes success-bounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Success animation transitions */
.success-animation-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.success-animation-leave-active {
  transition: all 0.3s ease-in;
}

.success-animation-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.success-animation-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Form styling overrides */
:deep(.user-form) {
  padding: 0;
}

:deep(.modal-footer) {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
}

:deep(.modal-footer .p-button) {
  transition: all 0.2s ease;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
}

:deep(.modal-footer .p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.modal-footer .p-button-danger) {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  border: none;
}

:deep(.modal-footer .p-button-danger:hover) {
  background: linear-gradient(135deg, #7f8c8d, #6c7b7c);
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

:deep(.modal-footer .p-button-success) {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #d35400));
  border: none;
}

:deep(.modal-footer .p-button-success:hover) {
  background: linear-gradient(135deg, var(--color-primary-dark, #d35400), #c0392b);
  box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .loading-spinner {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .success-title {
    font-size: 1.25rem;
  }

  .success-message {
    font-size: 1rem;
  }

  :deep(.modal-footer) {
    flex-direction: column;
  }

  :deep(.modal-footer .p-button) {
    width: 100%;
  }
}
</style> 