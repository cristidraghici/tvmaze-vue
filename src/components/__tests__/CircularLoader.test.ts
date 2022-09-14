import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { Quasar } from 'quasar'

import CircularLoader from '../CircularLoader.vue'

describe('CircularLoader', () => {
  it('renders properly', () => {
    const wrapper = mount(CircularLoader, {
      global: {
        plugins: [Quasar]
      }
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
