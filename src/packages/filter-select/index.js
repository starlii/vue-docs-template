/**
 * Created By shli on 2018/11/7
 */
import SstSelect from './src/index'

SstSelect.install = (Vue, opts) => {
  Vue.components(SstSelect.name, SstSelect)
}

export default SstSelect
