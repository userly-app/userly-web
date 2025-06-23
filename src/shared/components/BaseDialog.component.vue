<template>
  <Teleport to="body">
    <Transition name="dialog-backdrop" appear>
      <div
        v-if="modelValue"
        class="dialog-overlay"
        @click.self="handleBackdropClick"
        @keydown.esc="handleEscape"
        tabindex="-1"
        ref="overlayRef"
      >
        <Transition name="dialog-content" appear>
          <div
            v-if="modelValue"
            class="dialog-container"
            :class="[
              `dialog-${size}`,
              { 'dialog-mobile': isMobile }
            ]"
            role="dialog"
            :aria-labelledby="headerId"
            :aria-describedby="contentId"
            ref="dialogRef"
          >
            <!-- Header -->
            <div class="dialog-header" :id="headerId">
              <div class="dialog-title-section">
                <div class="dialog-icon" v-if="icon">
                  <i :class="icon"></i>
                </div>
                <h2 class="dialog-title">{{ title }}</h2>
              </div>
              <button
                class="dialog-close-btn"
                @click="handleClose"
                :aria-label="closeAriaLabel"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Content -->
            <div class="dialog-content" :id="contentId">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div class="dialog-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  closeAriaLabel: {
    type: String,
    default: 'Cerrar diálogo'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const overlayRef = ref(null)
const dialogRef = ref(null)
const headerId = computed(() => `dialog-header-${Math.random().toString(36).substr(2, 9)}`)
const contentId = computed(() => `dialog-content-${Math.random().toString(36).substr(2, 9)}`)
const isMobile = ref(false)

// Detectar dispositivo móvil
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Focus trap elements
let focusableElements = []
let firstFocusableElement = null
let lastFocusableElement = null

// Manejar focus trap
const setupFocusTrap = () => {
  if (!dialogRef.value) return
  
  focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  firstFocusableElement = focusableElements[0]
  lastFocusableElement = focusableElements[focusableElements.length - 1]
  
  if (firstFocusableElement) {
    firstFocusableElement.focus()
  }
}

const handleTabKey = (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement?.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement?.focus()
        e.preventDefault()
      }
    }
  }
}

// Event handlers
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handleEscape = () => {
  if (props.closeOnEscape) {
    handleClose()
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('keydown', handleTabKey)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('keydown', handleTabKey)
  document.body.style.overflow = 'auto'
})

// Watch for dialog opening/closing
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    await nextTick()
    setupFocusTrap()
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>

<style scoped>
/* Transiciones del backdrop */
.dialog-backdrop-enter-active,
.dialog-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-backdrop-enter-from,
.dialog-backdrop-leave-to {
  opacity: 0;
}

/* Transiciones del contenido */
.dialog-content-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.dialog-content-leave-active {
  transition: all 0.2s ease-in;
}

.dialog-content-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.dialog-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Layout del diálogo */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.dialog-container {
  background: var(--color-card);
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Tamaños del diálogo */
.dialog-small {
  width: 100%;
  max-width: 400px;
}

.dialog-medium {
  width: 100%;
  max-width: 600px;
}

.dialog-large {
  width: 100%;
  max-width: 800px;
}

.dialog-full {
  width: 95vw;
  height: 95vh;
  max-width: none;
  max-height: none;
}

/* Header */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-accent);
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-card) 100%);
}

.dialog-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #d35400));
  color: white;
  font-size: 1.2rem;
}

.dialog-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Nunito Sans', sans-serif;
}

.dialog-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.dialog-close-btn:hover {
  background: var(--color-accent);
  color: var(--color-text-primary);
  transform: scale(1.1);
}

.dialog-close-btn:active {
  transform: scale(0.95);
}

/* Content */
.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Footer */
.dialog-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-accent);
  background: var(--color-background);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .dialog-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .dialog-mobile {
    width: 100% !important;
    max-width: none !important;
    height: auto;
    max-height: 95vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    transform-origin: bottom;
  }

  .dialog-content-enter-from.dialog-mobile {
    transform: translateY(100%);
  }

  .dialog-content-leave-to.dialog-mobile {
    transform: translateY(100%);
  }

  .dialog-header {
    padding: 1rem 1.5rem;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .dialog-content {
    padding: 1.5rem;
  }

  .dialog-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
}

/* Scrollbar personalizado */
.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: var(--color-accent);
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: var(--color-text-secondary);
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
</style> 