import { useQuasar } from 'quasar'

export const useNotifications = () => {
  const quasar = useQuasar()

  const notifyError = (message: string) => {
    quasar.notify({
      progress: true,
      icon: 'error',
      color: 'red',
      timeout: 1000,

      message
    })
  }

  return {
    notifyError
  }
}
