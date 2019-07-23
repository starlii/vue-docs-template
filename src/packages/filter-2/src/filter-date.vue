<template>
  <el-form label-position="right" label-suffix=":" label-width="100px">
    <el-form-item :label="label">
      <sst-date-range :time.sync="time" />
    </el-form-item>
  </el-form>
</template>
<script>
import SstDateRange from '../../date-range'
export default {
  components: { SstDateRange },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      time: [],
      label: Object.keys(this.options).includes('dateLabel')
        ? this.options.dateLabel
        : ''
    }
  },
  watch: {
    data: {
      handler(val) {
        this.time = val.date ? JSON.parse(JSON.stringify(val.date)) : []
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    validate() {
      return {
        date: this.time
      }
    },
    resetFields() {
      this.time = this.data.date || []
    }
  }
}
</script>
