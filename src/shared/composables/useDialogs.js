import { ref, reactive } from 'vue'

export function useDialogs() {
  const dialogs = reactive({
    userForm: {
      visible: false,
      mode: 'create',
      user: null
    },
    confirm: {
      visible: false,
      config: null
    }
  })

  const confirmDialogRef = ref(null)
  const userFormDialogRef = ref(null)

  /**
   * Mostrar diálogo de formulario de usuario
   * @param {string} mode - 'create' o 'edit'
   * @param {Object|null} user - Datos del usuario para editar
   */
  const showUserFormDialog = (mode = 'create', user = null) => {
    dialogs.userForm.mode = mode
    dialogs.userForm.user = user
    dialogs.userForm.visible = true
  }

  /**
   * Ocultar diálogo de formulario de usuario
   */
  const hideUserFormDialog = () => {
    dialogs.userForm.visible = false
    dialogs.userForm.user = null
  }

  /**
   * Mostrar diálogo de confirmación
   * @param {Object} config - Configuración del diálogo
   */
  const showConfirmDialog = (config) => {
    const defaultConfig = {
      title: 'Confirmar Acción',
      icon: 'pi pi-question-circle',
      question: '¿Estás seguro?',
      description: '',
      details: '',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      confirmIcon: 'pi pi-check',
      loadingText: 'Procesando...',
      type: 'default'
    }

    dialogs.confirm.config = { ...defaultConfig, ...config }
    dialogs.confirm.visible = true

    return new Promise((resolve, reject) => {
      // Guardamos las funciones de resolución para uso posterior
      dialogs.confirm._resolve = resolve
      dialogs.confirm._reject = reject
    })
  }

  /**
   * Ocultar diálogo de confirmación
   */
  const hideConfirmDialog = () => {
    dialogs.confirm.visible = false
    dialogs.confirm.config = null
    if (dialogs.confirm._reject) {
      dialogs.confirm._reject(new Error('Dialog cancelled'))
      dialogs.confirm._reject = null
      dialogs.confirm._resolve = null
    }
  }

  /**
   * Confirmar acción en diálogo de confirmación
   */
  const confirmAction = () => {
    if (dialogs.confirm._resolve) {
      dialogs.confirm._resolve(true)
      dialogs.confirm._resolve = null
      dialogs.confirm._reject = null
    }
    hideConfirmDialog()
  }

  /**
   * Cancelar acción en diálogo de confirmación
   */
  const cancelAction = () => {
    hideConfirmDialog()
  }

  /**
   * Mostrar diálogo de confirmación de eliminación
   * @param {Object} item - Elemento a eliminar
   * @param {string} itemName - Nombre del elemento para mostrar
   * @param {string} itemType - Tipo de elemento (usuario, producto, etc.)
   */
  const showDeleteConfirmDialog = (item, itemName, itemType = 'elemento') => {
    return showConfirmDialog({
      title: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      question: `¿Estás completamente seguro?`,
      description: `Esta acción eliminará permanentemente ${itemType === 'usuario' ? 'al usuario' : 'el ' + itemType}`,
      details: `${itemName} y todos sus datos asociados del sistema. Esta operación no se puede deshacer.`,
      confirmText: `Sí, Eliminar ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
      cancelText: 'Cancelar',
      confirmIcon: 'pi pi-trash',
      loadingText: `Eliminando ${itemType}...`,
      type: 'danger'
    })
  }

  /**
   * Mostrar diálogo para crear usuario
   */
  const showCreateUserDialog = () => {
    showUserFormDialog('create', null)
  }

  /**
   * Mostrar diálogo para editar usuario
   * @param {Object} user - Datos del usuario a editar
   */
  const showEditUserDialog = (user) => {
    showUserFormDialog('edit', user)
  }


  const finishConfirmLoading = () => {
    if (confirmDialogRef.value) {
      confirmDialogRef.value.finishLoading()
    }
  }

  /**
   * Mostrar animación de éxito en diálogo de formulario
   */
  const showUserFormSuccess = () => {
    if (userFormDialogRef.value) {
      userFormDialogRef.value.showSuccessAnimation()
    }
  }

  /**
   * Establecer estado de loading en diálogo de formulario
   * @param {boolean} loading - Estado de loading
   */
  const setUserFormLoading = (loading) => {
    if (userFormDialogRef.value) {
      userFormDialogRef.value.setLoading(loading)
    }
  }

  return {
    dialogs,

    confirmDialogRef,
    userFormDialogRef,

    showUserFormDialog,
    hideUserFormDialog,
    showConfirmDialog,
    hideConfirmDialog,
    confirmAction,
    cancelAction,

    showDeleteConfirmDialog,
    showCreateUserDialog,
    showEditUserDialog,

    finishConfirmLoading,
    showUserFormSuccess,
    setUserFormLoading
  }
}

/**
 * Composable específico para diálogos de usuario
 */
export function useUserDialogs() {
  const {
    dialogs,
    confirmDialogRef,
    userFormDialogRef,
    showCreateUserDialog,
    showEditUserDialog,
    showDeleteConfirmDialog,
    hideUserFormDialog,
    confirmAction,
    cancelAction,
    finishConfirmLoading,
    showUserFormSuccess,
    setUserFormLoading
  } = useDialogs()

  /**
   * Confirmar eliminación de usuario
   * @param {Object} user - Usuario a eliminar
   */
  const confirmDeleteUser = (user) => {
    return showDeleteConfirmDialog(user, user.name, 'usuario')
  }

  return {
    dialogs,

    confirmDialogRef,
    userFormDialogRef,

    showCreateUserDialog,
    showEditUserDialog,
    confirmDeleteUser,
    hideUserFormDialog,

    confirmAction,
    cancelAction,
    finishConfirmLoading,
    showUserFormSuccess,
    setUserFormLoading
  }
} 