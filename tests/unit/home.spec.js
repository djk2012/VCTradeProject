
import Vue from 'vue'
global.Vue = Vue;
console.log('--global:',global.hasOwnProperty('Vue'))
Vue.config.productionTip = false
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import { Button, RadioGroup } from 'element-ui'
const localVue = createLocalVue()
localVue.component(Button.name, Button)
localVue.use(ElementUI)
const wrapper = mount(Home, {
  localVue
})

describe('Home.vue', () => {
  const vm = wrapper.vm;
  // 测试在创建的生命周期中调用方法
  it('Calling a method in the created lifecycle', () => {
    const getList = jest.fn()
    const options = {
      methods: { getList }
    }
    mount(Home, options)
    expect(getList).toBeCalled()
  })
  // 传值正确
  it('pass the value correctly', () => {
    expect(wrapper.vm.$data.page).toBe(1)
  })
  //渲染正确
  it('render correctly', () => {
    wrapper.setProps({
      userName: 'Zhang San'
    })
    expect(wrapper.find('#userName').exists()).toBe(true)
  })
  //判断有一个RadioGroup组件
  it('There is a RadioGroup component', () => {
    expect(wrapper.contains(RadioGroup)).toBe(true)
  })
  //输入框清除按钮点击的时候，页面只执行userNameChange方法
  it('When the input box clear button is clicked, the page only executes the userNameChange method', () => {
    wrapper.find("#userName").trigger('clear');
    expect(wrapper.vm.userNameChange.toBeCalled);
  })
  // 测试也是是否含有按钮
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })
})
