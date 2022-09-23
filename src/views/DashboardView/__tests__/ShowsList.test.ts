import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { Quasar } from 'quasar'

import ShowsList from '../ShowsList.vue'

describe('ShowsList', () => {
  it('renders properly without shows', () => {
    const wrapper = mount(ShowsList, {
      props: {
        title: 'ShowsList',
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
    expect(wrapper.text()).toContain('ShowsList')
    expect(wrapper.text()).toContain('No results to show')
  })
})
