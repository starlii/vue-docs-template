import Divider from './divider'
import Scrollbar from './scrollbar'

const install = Vue => {
  Vue.component(Divider.name, Divider)
  Vue.component(Scrollbar.name, Scrollbar)
}

export default {
  install
}
