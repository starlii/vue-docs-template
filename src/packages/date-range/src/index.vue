<template>
  <el-date-picker
    ref="date-picker"
    v-model="formDataSelf.time"
    :disabled="disabled"
    :popper-class="`sst-date-picker sst-date-picker-${cuid}`"
    :size="size"
    :style="{ width: width + 'px' }"
    :format="format"
    :value-format="valueFormat"
    type="daterange"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :picker-options="pickerOptions"
    @focus="pickerFocus"
    @change="pickerChange"
  />
</template>

<script>
import { getShortcuts, getStartAndEndTime } from './shortcuts'
import {
  getMonthDays,
  getLastQuarterMountsToToday,
  getLastYearMountsToToday,
  getQuarterMountsToToday,
  getYearMountsToToday,
  getlastTwoYearsMountsToToday
} from '../../utils/date'

export default {
  name: 'SstDateRange',
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    width: {
      type: Number,
      default: 300
    },
    format: {
      type: String,
      default: 'MM/dd/yyyy'
    },
    valueFormat: {
      type: String,
      default: 'MM/dd/yyyy'
    },
    rangeSeparator: {
      type: String,
      default: 'To'
    },
    startPlaceholder: {
      type: String,
      default: 'Start Date'
    },
    endPlaceholder: {
      type: String,
      default: 'End Date'
    },
    time: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selectOptions: {
      type: Array,
      default: () => {
        return [
          {
            label: 'Today',
            start: 0,
            end: 0
          },
          {
            label: 'Last 5 days',
            start: 4,
            end: 0
          },
          {
            label: 'Last 10 days',
            start: 9,
            end: 0
          },
          {
            label: 'Last 15 days',
            start: 14,
            end: 0
          },
          {
            label: 'Last 30 days',
            start: 29,
            end: 0
          },
          {
            label: 'Last 90 days',
            start: 89,
            end: 0
          },
          {
            label: 'Last 180 days',
            start: 179,
            end: 0
          },
          {
            label: 'Yesterday',
            start: 1,
            end: 1
          },
          {
            label: 'Yesterday-to-Date',
            start: 1,
            end: 0
          },
          {
            label: 'Last Week',
            start: new Date().getDay() + 7 - 1,
            end: new Date().getDay()
          },
          {
            label: 'Last Week-to-Date',
            start: new Date().getDay() + 7 - 1,
            end: 0
          },
          {
            label: 'Last Month',
            start:
              new Date().getDate() +
              getMonthDays(new Date().getFullYear(), new Date().getMonth()) -
              1,
            end: new Date().getDate()
          },
          {
            label: 'Last Month-to-Date',
            start:
              new Date().getDate() +
              getMonthDays(new Date().getFullYear(), new Date().getMonth()) -
              1,
            end: 0
          },
          {
            label: 'Last Quarter',
            start:
              getLastQuarterMountsToToday(
                new Date().getFullYear(),
                new Date().getMonth() + 1
              ) - 1,
            end: getQuarterMountsToToday(
              new Date().getFullYear(),
              new Date().getMonth() + 1
            )
          },
          {
            label: 'Last Quarter-to-Date',
            start:
              getLastQuarterMountsToToday(
                new Date().getFullYear(),
                new Date().getMonth() + 1
              ) - 1,
            end: 0
          },
          {
            label: 'Year-to-Date',
            start:
              getYearMountsToToday(
                new Date().getFullYear(),
                new Date().getMonth() + 1
              ) - 1,
            end: 0
          },
          {
            label: new Date().getFullYear() - 1,
            start:
              getLastYearMountsToToday(
                new Date().getFullYear(),
                new Date().getMonth() + 1
              ) - 1,
            end: getYearMountsToToday(
              new Date().getFullYear(),
              new Date().getMonth() + 1
            )
          },
          // {
          //   label: 'Last Year-to-Date',
          //   start: getLastYearMountsToToday(new Date().getFullYear(), new Date().getMonth() + 1) - 1,
          //   end: 0
          // },
          {
            label: new Date().getFullYear() - 2,
            start: getlastTwoYearsMountsToToday(
              new Date().getFullYear(),
              new Date().getMonth() + 1
            ),
            end: getLastYearMountsToToday(
              new Date().getFullYear(),
              new Date().getMonth() + 1
            )
          }
          // {
          //   label: 'Last Two Years-to-Date',
          //   start: getlastTwoYearsMountsToToday(new Date().getFullYear(), new Date().getMonth() + 1),
          //   end: 0
          // }
        ]
      }
    }
  },
  data() {
    return {
      cuid: Math.random().toFixed(3) * 1000,
      pickerOptions: {
        shortcuts: this.selectOptions.map(item => {
          return {
            text: item.label,
            startAndEndTime: getStartAndEndTime(item.start, item.end),
            onClick(picker) {
              getShortcuts(picker)(item.start, item.end)
            }
          }
        })
      },
      formDataSelf: {
        time: null
      }
    }
  },
  watch: {
    time: {
      handler(val) {
        this.formDataSelf.time = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    pickerFocus() {
      setTimeout(() => {
        const sstDatePicker = document
          .querySelector(`.sst-date-picker-${this.cuid}`)
          .querySelectorAll('.el-picker-panel__shortcut')
        const formDate = {
          formDateYear_1: this.formDataSelf.time
            ? new Date(this.formDataSelf.time[0]).getFullYear()
            : null,
          formDateYear_2: this.formDataSelf.time
            ? new Date(this.formDataSelf.time[1]).getFullYear()
            : null,
          formDateMonth_1: this.formDataSelf.time
            ? new Date(this.formDataSelf.time[0]).getMonth()
            : null,
          formDateMonth_2: this.formDataSelf.time
            ? new Date(this.formDataSelf.time[1]).getMonth()
            : null,
          formDateDate_1: this.formDataSelf.time
            ? new Date(this.formDataSelf.time[0]).getDate()
            : null,
          formDateDate_2: this.formDataSelf.time
            ? new Date(this.formDataSelf.time[1]).getDate()
            : null
        }
        sstDatePicker.forEach((item, index) => {
          const shortcut = {
            shortcutsYear_1: new Date(
              this.pickerOptions.shortcuts[index].startAndEndTime[0]
            ).getFullYear(),
            shortcutsYear_2: new Date(
              this.pickerOptions.shortcuts[index].startAndEndTime[1]
            ).getFullYear(),
            shortcutsMonth_1: new Date(
              this.pickerOptions.shortcuts[index].startAndEndTime[0]
            ).getMonth(),
            shortcutsMonth_2: new Date(
              this.pickerOptions.shortcuts[index].startAndEndTime[1]
            ).getMonth(),
            shortcutsDate_1: new Date(
              this.pickerOptions.shortcuts[index].startAndEndTime[0]
            ).getDate(),
            shortcutsDate_2: new Date(
              this.pickerOptions.shortcuts[index].startAndEndTime[1]
            ).getDate()
          }
          item.className = 'el-picker-panel__shortcut'
          if (this.formDataSelf.time) {
            const isEqual = ['Year', 'Month', 'Date']
              .map(o => {
                return (
                  shortcut[`shortcuts${o}_1`] === formDate[`formDate${o}_1`] &&
                  shortcut[`shortcuts${o}_2`] === formDate[`formDate${o}_2`]
                )
              })
              .every(i => i === true)
            if (isEqual) {
              item.className = 'el-picker-panel__shortcut active'
            }
          }
        })
      }, 100)
    },
    pickerChange(val) {
      this.$emit('update:time', val)
      this.$emit('change', val)
    },
    focus(val) {
      this.$emit('onFocus', val)
    },
    blur(val) {
      this.$emit('onBlur', val)
    },
    handlerFocus() {
      this.$refs['date-picker'].focus()
    }
  }
}
</script>

<style lang="scss">
.sst-date-picker {
  .el-picker-panel__sidebar {
    width: 170px;
  }
  .el-picker-panel__sidebar + .el-picker-panel__body {
    margin-left: 170px;
  }
}
</style>
