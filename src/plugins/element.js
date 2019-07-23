import Vue from 'vue'
import Element from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/demo-styles/index.scss'
import '@/assets/style/common.scss'
import '@/assets/style/fonts/style.css'

import demoBlock from '@/components/demo-block'

Vue.component('demo-block', demoBlock)

Vue.use(Element, { size: 'mini' })
