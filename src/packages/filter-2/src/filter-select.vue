<template>
  <el-form label-position="right" label-suffix=":" label-width="100px">
    <el-form-item :label="label">
      <el-select
        v-model="select"
        :multiple="multiple"
        collapse-tags
        placeholder="Select"
      >
        <el-option
          v-for="(item, index) in selectList"
          :key="index"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    },
    options: {
      Object
    }
  },
  data() {
    return {
      select: null,
      selectList: [],
      label: Object.keys(this.options).includes('selectLabel')
        ? this.options.selectLabel
        : '',
      multiple: Object.keys(this.options).includes('multiple')
        ? this.options.multiple
        : Array.isArray(this.data['select'])
    }
  },
  watch: {
    data: {
      handler(val) {
        console.log('data', val)
        this.select = val.select || null
        this.selectList = val.selectList || []
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    validate() {
      return {
        select: this.select
      }
    },
    resetFields() {
      this.select = this.data.select || null
    }
  }
}
</script>
