<template>
  <BaseDialog
    v-model="dialogVisible"
    :title="title"
    :icon="icon"
    size="small"
    :close-on-backdrop="!isLoading"
    :close-on-escape="!isLoading"
    @close="handleCancel"
  >
    <div class="confirm-content">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner">
          <i class="pi pi-spin pi-spinner"></i>
        </div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>

      <!-- Confirmation content -->
      <div v-else class="confirmation-state">
        <!-- Warning icon with animation -->
        <div class="warning-icon" :class="{ 'shake': showWarning }">
          <i class="pi pi-exclamation-triangle"></i>
        </div>

        <!-- Message -->
        <div class="confirm-message">
          <h3 class="confirm-question">{{ question }}</h3>
          <p class="confirm-description" v-if="description">
            {{ description }}
          </p>
          <div class="confirm-details" v-if="details">
            <p class="detail-text">{{ details }}</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="confirm-actions">
        <button
          class="cancel-btn"
          @click="handleCancel"
          :disabled="isLoading"
        >
          <i class="pi pi-times"></i>
          <span>{{ cancelText }}</span>
        </button>
        <button
          class="confirm-btn"
          @click="handleConfirm"
          :disabled="isLoading"
          :class="{ 'loading': isLoading }"
        >
          <i v-if="!isLoading" :class="confirmIcon"></i>
          <i v-else class="pi pi-spin pi-spinner"></i>
          <span>{{ confirmText }}</span>
        </button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseDialog from './base-dialog.component.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar Acción'
  },
  icon: {
    type: String,
    default: 'pi pi-question-circle'
  },
  question: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmIcon: {
    type: String,
    default: 'pi pi-check'
  },
  loadingText: {
    type: String,
    default: 'Procesando...'
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'danger', 'warning', 'info'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isLoading = ref(false)
const showWarning = ref(false)

// Handle confirm action
const handleConfirm = async () => {
  isLoading.value = true
  try {
    await emit('confirm')
    // El parent cerrará el dialog después de procesar
  } catch (error) {
    console.error('Error in confirmation:', error)
    isLoading.value = false
  }
}

const handleCancel = () => {
  if (!isLoading.value) {
    emit('cancel')
    emit('update:modelValue', false)
  }
}

// Watch for dialog opening to trigger warning animation
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    showWarning.value = false
    setTimeout(() => {
      showWarning.value = true
    }, 300)
  } else {
    isLoading.value = false
    showWarning.value = false
  }
})

// Método público para finalizar loading
const finishLoading = () => {
  isLoading.value = false
  emit('update:modelValue', false)
}

// Exponer método para uso del parent
defineExpose({
  finishLoading
})
</script>

<style scoped>
.confirm-content {
  text-align: center;
  padding: 1rem 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 0;
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
}

.loading-text {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Confirmation State */
.confirmation-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.warning-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-size: 2rem;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.warning-icon.shake {
  animation: shake 0.5s ease-in-out, pulse 2s infinite;
}

.confirm-message {
  max-width: 400px;
}

.confirm-question {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.confirm-description {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.confirm-details {
  background: var(--color-background);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.detail-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

/* Actions */
.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.cancel-btn {
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 2px solid var(--color-accent);
}

.cancel-btn:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.confirm-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: 2px solid transparent;
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.confirm-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.confirm-btn.loading {
  pointer-events: none;
}

/* Animations */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .confirm-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .confirm-btn {
    width: 100%;
    min-width: auto;
  }

  .warning-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .confirm-question {
    font-size: 1.1rem;
  }
}
</style> 