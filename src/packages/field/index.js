import Field from './src/index.vue'

Field.install = Vue => {
  Vue.component(Field.name, Field)
}

export default Field
