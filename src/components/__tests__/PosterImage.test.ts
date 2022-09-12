import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import PosterImage from '../PosterImage.vue'

describe('PosterImage', () => {
  it('renders properly', () => {
    const wrapper = mount(PosterImage, { props: { src: 'https://path.to/image', name: 'image' } })
    expect(wrapper.html()).toContain('https://path.to/image')
  })
})
