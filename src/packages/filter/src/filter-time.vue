<template>
  <div class="filter-time-container">
    <div>
      <el-date-picker
        ref="date-picker"
        v-model="formDataSelf.time"
        :popper-class="`sst-date-picker-${cuid}`"
        :size="size"
        style="width: 300px"
        format="MM/dd/yyyy"
        value-format="MM/dd/yyyy"
        type="daterange"
        range-separator="To"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        :picker-options="pickerOptions2"
        @focus="pickerFocus"
      />
      <!--<el-checkbox v-model="formDataSelf.timeReversal" class="info" label="! Reversal"></el-checkbox>-->
    </div>
    <div v-if="showValue" class="time-value">
      <div>
        Min
        <el-input
          ref="minInput"
          v-model.trim="formDataSelf.min"
          :size="size"
          class="input-small"
          @keyup.native="valueValidate('min')"
          @blur="valueValidate('min')"
        />
      </div>
      <div>
        Max
        <el-input
          ref="maxInput"
          v-model.trim="formDataSelf.max"
          :size="size"
          class="input-small"
          @keyup.native="valueValidate('max')"
          @blur="valueValidate('max')"
        />
      </div>
    </div>
    <div v-if="maxValidate">
      <i class="el-icon-error sst-red" />&nbsp;&nbsp;
      <!--<span class="sst-red" v-if="integerValidate">Value not a integer <span v-if="maxValidate">、</span></span>-->
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
  </div>
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
} from './utils'
import validate from './valueValidate'
export default {
  name: 'FilterTime',
  mixins: [validate],
  props: {
    filter: { type: String, default: null },
    showValue: {
      type: Boolean,
      default: false
    },
    filterDate: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: 'mini'
    },
    popoverShow: {
      type: Boolean,
      default: false
    },
    valueType: {
      type: String,
      default: null
    }
  },
  data() {
    const selectOptions = [
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
        start:
          getlastTwoYearsMountsToToday(
            new Date().getFullYear(),
            new Date().getMonth() + 1
          ) - 1,
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
    const shortcuts = selectOptions.map(item => {
      return {
        text: item.label,
        startAndEndTime: getStartAndEndTime(item.start, item.end),
        onClick(picker) {
          getShortcuts(picker)(item.start, item.end)
        }
      }
    })
    return {
      cuid: this._cuid,
      formDataSelf: {
        time: null,
        min: null,
        max: null,
        timeReversal: false,
        valueReversal: false
      },
      minValidator: null,
      Frequency: null,
      dateFrom: null,
      dateTo: null,
      pickerOptions2: {
        shortcuts: shortcuts
      }
    }
  },
  watch: {
    filterDate(val) {
      this.formDataSelf = Object.assign({}, val)
    },
    popoverShow(val) {
      val && this.$refs['date-picker'].focus()

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
              this.pickerOptions2.shortcuts[index].startAndEndTime[0]
            ).getFullYear(),
            shortcutsYear_2: new Date(
              this.pickerOptions2.shortcuts[index].startAndEndTime[1]
            ).getFullYear(),
            shortcutsMonth_1: new Date(
              this.pickerOptions2.shortcuts[index].startAndEndTime[0]
            ).getMonth(),
            shortcutsMonth_2: new Date(
              this.pickerOptions2.shortcuts[index].startAndEndTime[1]
            ).getMonth(),
            shortcutsDate_1: new Date(
              this.pickerOptions2.shortcuts[index].startAndEndTime[0]
            ).getDate(),
            shortcutsDate_2: new Date(
              this.pickerOptions2.shortcuts[index].startAndEndTime[1]
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
    }
  },
  created() {
    this.formDataSelf = Object.assign({}, this.filterDate)
  },
  methods: {
    pickerFocus(event) {},
    confirm() {
      this.$emit('setTimeDate', this.filter, this.formDataSelf)
    },
    cancel() {
      this.formDataSelf = this.showValue
        ? {
            time: null,
            min: null,
            max: null
          }
        : {
            time: null
          }

      this.$emit('setTimeDate', this.filter, this.formDataSelf)
    }
  }
}
</script>
<style scoped></style>
