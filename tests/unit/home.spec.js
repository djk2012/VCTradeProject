
import Vue from 'vue'
global.Vue = Vue;
console.log('--global:',global.hasOwnProperty('Vue'))
Vue.config.productionTip = false

// use the compoment from elementui
import ElementUI from 'element-ui';

// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import { mount, createLocalVue } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import { Button } from 'element-ui'

const localVue = createLocalVue()
localVue.component(Button.name, Button)
localVue.use(ElementUI)
const wrapper = mount(Home, { localVue })

describe('Home.vue', () => {
  const vm = wrapper.vm;
  it('Calling a method in the created lifecycle', () => {
    const getList = jest.fn()
    const options = {
      methods: { getList }
    }
    mount(Home, options)
    expect(getList).toBeCalled()
  })
  it('Default paging parameter 1', () => {
    expect(wrapper.vm.$data.page).toBe(1)
  })
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  test('triggers a click', async () => {
    await wrapper.trigger('click')
  })


})
