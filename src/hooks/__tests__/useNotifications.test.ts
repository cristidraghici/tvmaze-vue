import { describe, expect, it, vi } from 'vitest'

import { useNotifications } from '../useNotifications'
import * as quasar from 'quasar'

vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: vi.fn()
  })
}))

describe('useNotifications', () => {
  it.skip('shows a notification', () => {
    const hook = quasar.useQuasar()

    const { notifyError } = useNotifications()
    notifyError('error')

    expect(hook.notify).toHaveBeenCalledOnce()
  })
})
