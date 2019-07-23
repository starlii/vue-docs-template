<template>
  <el-form
    ref="form"
    label-position="right"
    label-suffix=":"
    label-width="100px"
    :model="formDate"
    :rules="formRules"
    inline
  >
    <el-form-item label="Min" prop="min">
      <el-input
        :value="formDate.min"
        :type="options.InputType || 'number'"
        @input="handlerChange($event, 'min')"
      />
    </el-form-item>
    <el-form-item label="Max" prop="max">
      <el-input
        :value="formDate.max"
        :type="options.InputType || 'number'"
        @input="handlerChange($event, 'max')"
      />
    </el-form-item>
  </el-form>
</template>
<script>
import * as vuelidate from 'vuelidate/lib/validators'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        min: null,
        max: null
      })
    },
    options: {
      type: Object,
      default: () => ({
        valueFormat: ['integer'] // integer 整数  decimal 可以带两位小数  positive 正数   negative 负数
      })
    }
  },
  data() {
    const maxValidate = (rule, value, cb) => {
      if (typeof value !== 'object' && value) {
        if (
          typeof this.formDate.min !== 'object' &&
          this.formDate.min &&
          Number(value) < Number(this.formDate.min)
        ) {
          return cb(
            new Error(`Must be less than or equals to ${this.formDate.min}`)
          )
        }
      }

      cb()
    }

    const minValidate = (rule, value, cb) => {
      if (typeof value !== 'object' && value) {
        if (
          typeof this.formDate.max !== 'object' &&
          this.formDate.max &&
          Number(value) > Number(this.formDate.max)
        ) {
          return cb(
            new Error(`Must be greater than or equals to ${this.formDate.max}`)
          )
        }
      }

      cb()
    }
    return {
      formDate: {
        min: null,
        max: null
      },
      formRules: {
        min: [
          {
            validator: minValidate,
            trriger: ['change', 'blur']
          }
        ],
        max: [
          {
            validator: maxValidate,
            trriger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.formDate = {
          min: val.min || null,
          max: val.max || null
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    validate() {
      let isValid = true
      this.$refs['form'].validate(valid => {
        if (!valid) isValid = false
      })
      return isValid ? this.formDate : false
    },
    resetFields() {
      this.$refs['form'].clearValidate()
      this.formDate = {
        min: this.data.min || null,
        max: this.data.max || null
      }
    },
    handlerChange(value, f) {
      if (this.options.valueFormat && this.options.valueFormat.length > 0) {
        let error = false
        this.options.valueFormat.forEach(item => {
          if (item !== 'decimal') {
            if (['positive', 'negative'].includes(item)) {
              if (
                !vuelidate[item === 'positive' ? 'minValue' : 'maxValue'](0)(
                  value
                )
              )
                error = true
            } else {
              if (!vuelidate[item](value)) error = true
            }
          } else {
            if (
              !vuelidate['decimal'](value) ||
              !/^\d+(\.\d{1,2})?$/.test(value)
            )
              error = true
          }
        })

        if (!error) this.$set(this.formDate, f, value)
      } else {
        this.$set(this.formDate, f, value)
      }
    }
  }
}
</script>
