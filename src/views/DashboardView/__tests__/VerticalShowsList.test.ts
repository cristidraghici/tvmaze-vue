import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { Quasar } from 'quasar'

import VerticalShowsList from '../VerticalShowsList.vue'

describe('VerticalShowsList', () => {
  it('renders properly without shows', () => {
    const wrapper = mount(VerticalShowsList, {
      props: {
        title: 'VerticalShowsList',
        noResultsText: 'No results to show',
        shows: [],
        hasMore: false,
        isLoading: false,

        isHorizontal: false
      },
      global: {
        plugins: [Quasar]
      }
    })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.text()).toContain('VerticalShowsList')
    expect(wrapper.text()).toContain('No results to show')
  })
})
