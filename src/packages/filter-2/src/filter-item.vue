<template>
  <el-popover>
    <slot v-bind="scope" />
    <el-button slot="reference" class="select__drop">
      <span>{{ `${prop || 'Label'}: ` }}</span>
      <span v-if="scope.data.label">{{ scope.data.label }}</span>
      <span v-else class="info">Select</span>
      <i class="el-icon-caret-bottom" />
    </el-button>
  </el-popover>
</template>
<script>
export default {
  props: {
    prop: String
  },
  data() {
    return {
      scope: this.$parent.$parent.options[this.prop]
    }
  },
  created() {}
}
//
</script>
//
<style lang="scss">
// @import 'filter.scss';
//
</style>
