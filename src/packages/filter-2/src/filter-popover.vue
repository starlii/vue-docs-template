<template>
  <el-popover v-model="show" trigger="click">
    <el-form>
      <component
        :is="template"
        v-for="(template, index) in templates"
        :key="index"
        :ref="template"
        :data="data"
        :options="options"
        @change="Object.keys($event).forEach(k => (data[k] = $event[k]))"
      />
    </el-form>
    <div v-if="templates.length" style="text-align: center">
      <el-button type="primary" @click="handlerConfirm">Confirm</el-button>
      <el-button @click="handlerCancel">Cancel</el-button>
    </div>
    <el-button slot="reference" class="select__drop">
      <span>{{ `${name || 'Label'}: ` }}</span>
      <span v-if="isLabel()">{{ placeLabel }}</span>
      <span v-else>Select </span>
      <i class="el-icon-caret-bottom" />
    </el-button>
  </el-popover>
</template>
<script>
import FilterValue from './filter-value'
import FilterSelect from './filter-select'
import FilterDate from './filter-date'
export default {
  components: { FilterValue, FilterSelect, FilterDate },
  props: {
    name: String,
    templates: Array,
    data: Object,
    options: Object,
    format: { type: Function, default: val => val }
  },

  data() {
    return {
      show: false
    }
  },
  computed: {
    placeLabel() {
      let place = []
      let str = this.stringQuery(
        this.format(this.data['min'] || null),
        this.format(this.data['max'] || null)
      )
      if (str) place.push(str)

      let selectStr = this.templates.includes('filter-select')
        ? Array.isArray(this.data['select'])
          ? this.data['selectList']
              .filter(s => this.data['select'].includes(s.value))
              .map(t => t.label)
              .join(',')
          : this.data['selectList'].findIndex(
              s => s.value === this.data['select']
            ) > -1
          ? this.data['select']
          : false
        : false

      if (selectStr) place.push(selectStr)

      let dateStr = this.templates.includes('filter-date')
        ? Array.isArray(this.data['date'])
          ? this.stringQuery(
              this.data['date'][0] || null,
              this.data['date'][1] || null
            )
          : false
        : false

      if (dateStr) place.push(dateStr)

      return place.join(';')
    }
  },
  methods: {
    stringQuery(a, b) {
      let parse = s =>
        typeof s === 'object' ? false : String(s).length ? s : false
      a = parse(a)
      if (b === 'undefined') return a
      else {
        b = parse(b)
        return a && b ? (a === b ? a : `${a}-${b}`) : !a && !b ? false : a || b
      }
    },
    isLabel() {
      return this.data
        ? Object.values(this.data).every(i => {
            if (i instanceof Object && Array.isArray(i)) {
              i.forEach(a => {
                return typeof a === 'object'
                  ? true
                  : String(a).length
                  ? false
                  : true
              })
            } else
              typeof i === 'object' ? true : String(i).length ? false : true
          })
          ? false
          : true
        : false
    },
    handlerConfirm() {
      let error = false
      this.templates.forEach(t => {
        let result = this.$refs[t][0].validate()
        if (result) {
          Object.keys(result).forEach(r => {
            this.$set(this.data, r, result[r])
          })
          this.$emit('change', t, result)
        } else error = true
      })
      if (!error) this.show = false
    },
    handlerCancel() {
      console.log('this.$refs', this.$refs)
      this.templates.forEach(t => {
        console.log('this.$refs', this.$refs)
        this.$refs[t][0].resetFields()
      })
      this.show = false
    }
  }
}
</script>
