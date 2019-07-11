import Divider from './divider'
import DateRange from './date-range'
import Field from './field'
import Filter from './filter'
import FilterPopop from './filter-popop'
import FilterSelect from './filter-select'
import Input from './input'
import LineTitle from './line-title'
import Page from './page'

const components = [
  Divider,
  DateRange,
  Field,
  Filter,
  FilterPopop,
  FilterSelect,
  Input,
  LineTitle,
  Page
]

const install = Vue => {
  components.map(com => {
    Vue.component(com.name, com)
  })
}

export default {
  install,
  ...components
}
