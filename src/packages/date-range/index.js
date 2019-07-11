/**
 * Created By shli on 2018/10/15
 */
import DateRange from './src'

Object.defineProperty(DateRange, 'install', {
  writable: false,
  enumerable: true,
  configurable: false,
  value(Vue, options) {
    Vue.component(DateRange.name, DateRange)
  }
})

export default DateRange
