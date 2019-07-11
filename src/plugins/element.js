import Vue from 'vue'
import { Scrollbar, Button, Row, Col, Backtop, Icon } from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/demo-styles/index.scss'
import '@/assets/style/common.scss'
import '@/assets/style/fonts/style.css'

import demoBlock from '@/components/demo-block'

Vue.component('demo-block', demoBlock)

Vue.use(Scrollbar)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Backtop)
Vue.use(Icon)
