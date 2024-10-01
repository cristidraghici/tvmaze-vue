import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { MockedFunction } from 'vitest'
import { mount } from '@vue/test-utils'

import { Quasar } from 'quasar'
import { useRoute } from 'vue-router'

import ShowDetailsView from '../ShowDetailsView.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}))

// const useRouteMock = useRoute as unknown as MockedFunction<typeof useRoute>

describe('ShowDetailsView', () => {
  beforeEach(() => {
    // useRouteMock.mockImplementation(() => ({
    //   params: {
    //     id: '1'
    //   }
    // }))
  })

  it.skip('renders properly', () => {
    const wrapper = mount(ShowDetailsView, {
      global: {
        plugins: [Quasar]
      }
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
