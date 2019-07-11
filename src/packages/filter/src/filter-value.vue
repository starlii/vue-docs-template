<template>
  <section class="filter-time-container">
    <div>
      <div>
        <span class="item-label">Min:</span>
        <el-input
          v-model.trim="formDataSelf.min"
          :size="size"
          class="input-small"
          placeholder="Min"
          @keyup.native="valueValidate('min')"
          @blur="valueValidate('min')"
        />
      </div>
      <div class="max-value">
        <span class="item-label">Max:</span>
        <el-input
          v-model.trim="formDataSelf.max"
          :size="size"
          class="input-small"
          placeholder="Max"
          @keyup.native="valueValidate('max')"
          @blur="valueValidate('max')"
        />
      </div>
    </div>
    <div v-if="maxValidate">
      <i class="el-icon-error sst-red" />&nbsp;&nbsp;
      <span v-if="maxValidate" class="sst-red"
        >Max must be greater than the min</span
      >
    </div>
    <div class="center">
      <el-button
        :size="size"
        type="primary"
        :disabled="maxValidate"
        @click="confirm"
        >OK</el-button
      >
      <el-button :size="size" @click="cancel">Cancel</el-button>
    </div>
  </section>
</template>

<script>
import validate from './valueValidate'
export default {
  name: 'FilterValue',
  mixins: [validate],
  props: {
    filterDate: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: 'mini'
    },
    valueType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      formDataSelf: {
        min: null,
        max: null,
        reversal: false
      },
      minValidator: null
    }
  },
  watch: {
    filterDate(val) {
      this.formDataSelf = Object.assign({}, val)
    }
  },
  created() {
    this.formDataSelf = Object.assign({}, this.filterDate)
    console.log('valueType', this.valueType)
  },
  methods: {
    confirm() {
      this.$emit('changePopover', this.formDataSelf)
    },
    cancel() {
      this.formDataSelf = {
        min: null,
        max: null
      }
      this.$emit('changePopover', this.formDataSelf)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-time-container {
  .input-content {
    display: flex;
  }
  & > div {
    margin: 6px 0;
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 10px;
    }
    .el-select:last-of-type {
      margin-left: 10px;
    }
  }
  .el-select {
  }
  .max-value {
    margin-left: 10px;
  }

  .item-label {
    width: 35px;
    text-align: right;
  }
  .time-value {
    & > div:nth-of-type(2) {
      margin-left: 15px;
    }
  }
  .center {
    margin-top: 18px;
    display: flex;
    justify-content: center;
  }

  .input-error {
    position: relative;
    font-size: 10px;
    color: #f56c6c;
    left: 30px;
  }
}
</style>
