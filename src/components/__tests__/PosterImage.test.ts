import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import PosterImage from '../PosterImage.vue'

describe('PosterImage', () => {
  it('shows the image', () => {
    const wrapper = mount(PosterImage, { props: { src: 'https://path.to/image', name: 'image' } })
    expect(wrapper.html()).toContain('https://path.to/image')
  })

  it('shows the name', () => {
    const wrapper = mount(PosterImage, { props: { src: '', name: 'image name' } })
    expect(wrapper.html()).toContain('image name')
  })
})
