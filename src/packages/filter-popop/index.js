/**
 * Created By shli on 2018/11/6
 */
import Popup from './src/filter-popup'

Popup.install = (Vue, opts) => {
  Vue.components(Popup.name, Popup)
}

export default Popup
