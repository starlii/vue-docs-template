<template>
  <div class="filter-item">
    <el-button
      v-if="filterTypes.device.indexOf(filter) >= 0"
      :size="size"
      class="select__drop"
      @click.native="showDevice"
    >
      <span
        >Device <span v-if="filterDate.length">({{ filterDate.length }})</span>:
        <span v-if="!filterDate.length" class="info">Select</span>
        <span v-else class="device-input">{{
          filterDate
            .map(item => {
              return `${item.shortName}(${item.itemCount || 0})`
            })
            .join(',')
        }}</span>
      </span>
      <i class="el-icon-caret-bottom right" />
    </el-button>
    <el-button
      v-else-if="filterTypes.label.indexOf(filter) >= 0"
      :size="size"
      class="select__drop"
      @click.native="showLabels"
    >
      <span
        >Item Labels
        <span v-if="filterDate.length">({{ filterDate.length }})</span>:
        <span v-if="!filterDate.length" class="info">Select</span>
        <span v-else class="label-input">
          <span
            v-for="item in filterDate.slice(0, 3)"
            :key="item.shortName"
            class="label-item"
            >{{ `${item.shortName}(${item.itemCount || 0})` }}</span
          >
          <span v-if="filterDate.length > 3">...</span>
        </span>
      </span>
      <i class="el-icon-caret-bottom right" />
    </el-button>

    <el-popover
      v-else
      v-model="popoverShow"
      placement="bottom"
      trigger="manual"
    >
      <div
        is="FilterTime"
        v-if="
          filterTypes.time.indexOf(filter) >= 0 ||
            filterTypes.timeAndValue.indexOf(filter) >= 0
        "
        :ref="`value-${filter}`"
        :size="size"
        :filter="filter"
        :filter-date="filterDateCopy"
        :value-type="valueType"
        :popover-show="popoverShow"
        :show-value="
          filterTypes.timeAndValue.indexOf(filter) >= 0 ? true : false
        "
        @changePopover="handlePopoverStatus"
        @setTimeDate="handleTimeSetDate"
      />
      <div
        is="FilterValue"
        v-if="filterTypes.value.indexOf(filter) >= 0"
        :ref="`value-${filter}`"
        :size="size"
        :value-type="valueType"
        :filter="filter"
        :filter-date="filterDateCopy"
        @changePopover="handlePopoverStatus"
      />
      <div
        is="FilterReOrder"
        v-if="filterTypes.reOrder.indexOf(filter) >= 0"
        :ref="`value-${filter}`"
        :size="size"
        :filter="filter"
        :filter-date="filterDateCopy"
        @changePopover="handlePopoverStatus"
      />
      <div
        is="FilterSelect"
        v-if="
          filterTypes.select.indexOf(filter) >= 0 ||
            filterTypes.selectAndTimeAndValue.indexOf(filter) >= 0
        "
        :ref="`value-${filter}`"
        :size="size"
        :show-value="
          filterTypes.selectAndTimeAndValue.indexOf(filter) >= 0 ? true : false
        "
        :filter="filter"
        :value-type="valueType"
        :filter-date="filterDateCopy"
        :select-options="selectList[filter] ? selectList[filter] : null"
        @changePopover="handlePopoverStatus"
      />
      <el-button
        slot="reference"
        :size="size"
        class="select__drop"
        @click="HandleReference"
      >
        <span
          >{{
            valueTypeList.indexOf(filter) >= 0
              ? `${label[filter] || ''} ${filter}`
              : filter
          }}:
          <span
            v-if="filterTypes.time.indexOf(filter) >= 0 && filterDateCopy.time"
          >
            {{
              filterDateCopy.time[0] === filterDateCopy.time[1]
                ? filterDateCopy.time[0]
                : `${filterDateCopy.time[0]} - ${filterDateCopy.time[1]}`
            }}
          </span>
          <span
            v-else-if="
              filterTypes.timeAndValue.indexOf(filter) >= 0 &&
                (filterDateCopy.time ||
                  filterDateCopy.min ||
                  filterDateCopy.max)
            "
          >
            {{
              filterDateCopy | parseTimeAndValue(prefix[filter], suffix[filter])
            }}
          </span>
          <span
            v-else-if="
              filterTypes.value.indexOf(filter) >= 0 &&
                (filterDateCopy.min || filterDateCopy.max)
            "
          >
            {{
              filterDateCopy.max && !filterDateCopy.min
                ? `&infin; - ${prefix[filter] ? prefix[filter] : ''}${comdify(
                    filterDateCopy.max
                  )}${suffix[filter] ? suffix[filter] : ''}`
                : !filterDateCopy.max && filterDateCopy.min
                ? `${prefix[filter] ? prefix[filter] : ''}${comdify(
                    filterDateCopy.min
                  )}${suffix[filter] ? suffix[filter] : ''} - ?`
                : filterDateCopy.min === filterDateCopy.max
                ? `${prefix[filter] ? prefix[filter] : ''}${comdify(
                    filterDateCopy.min
                  )}${suffix[filter] ? suffix[filter] : ''}`
                : `${prefix[filter] ? prefix[filter] : ''}${comdify(
                    filterDateCopy.min
                  )}${suffix[filter] ? suffix[filter] : ''} - ${
                    prefix[filter] ? prefix[filter] : ''
                  }${comdify(filterDateCopy.max)}${
                    suffix[filter] ? suffix[filter] : ''
                  }`
            }}
          </span>

          <span
            v-else-if="
              filterTypes.reOrder.indexOf(filter) >= 0 &&
                filterDateCopy.relation
            "
          >
            {{ filterDateCopy | parseReOrder }}
          </span>
          <span
            v-else-if="
              filterTypes.selectAndTimeAndValue.indexOf(filter) >= 0 &&
                filterDateCopy.value.length
            "
          >
            {{
              filterDateCopy
                | parseSelectAndTimeAndValue(
                  prefix[filter],
                  suffix[filter],
                  selectList[filter]
                )
            }}
          </span>
          <span
            v-else-if="
              filterTypes.select.indexOf(filter) >= 0 &&
                filterDateCopy.value.length
            "
          >
            <span class="device-input">{{ parseSelectValue }}</span>
          </span>
          <span v-else class="info"> Select </span>
        </span>
        <i class="el-icon-caret-bottom right" />
      </el-button>
    </el-popover>
    <span class="delete__icon" @click="deleteFilterItem">
      <i class="el-icon-circle-close" />
    </span>
  </div>
</template>

<script>
import FilterValue from './filter-value'
import FilterTime from './filter-time'
import FilterReOrder from './filter-reOrder'
import FilterSelect from './filter-select'
import { comdify } from '../../utils/thousands'
export default {
  name: 'FilterItem',
  components: {
    FilterValue,
    FilterTime,
    FilterReOrder,
    FilterSelect
  },
  filters: {
    parseTimeAndValue(val, prefix, suffix) {
      prefix = prefix || ''
      suffix = suffix || ''
      const { time, max, min } = val
      const timeShow = !time
        ? false
        : time[0] === time[1]
        ? time[0]
        : `${time[0]} - ${time[1]}`

      const valueShow =
        !max && !min
          ? false
          : !max && min
          ? `${prefix}${comdify(min)}${suffix} - ?`
          : max && !min
          ? `? - ${prefix}${comdify(max)}${suffix}`
          : min === max
          ? `${prefix}${comdify(min)}${suffix}`
          : `${prefix}${comdify(min)}${suffix} -  ${prefix}${comdify(
              max
            )}${suffix}`

      if (timeShow && valueShow) return `${timeShow}; ${valueShow}`
      if (timeShow && !valueShow) return `${timeShow}`

      if (!timeShow && valueShow) return `${valueShow}`
      if (!timeShow && !valueShow) return false
    },
    parseReOrder(value) {
      const { max, min, relation } = value
      const notGtShow =
        relation === 'gt'
          ? false
          : relation === 'lt'
          ? '< 0'
          : relation === 'eq'
          ? '= 0'
          : false
      const gtShow =
        !max && !min
          ? '>0'
          : max && !min
          ? '<' + comdify(max)
          : !max && min
          ? '>' + comdify(min)
          : min === max
          ? '= ' + comdify(min)
          : `${comdify(min)}<?<${comdify(max)}`

      return notGtShow || gtShow
    },
    parseSelectAndTimeAndValue(val, prefix, suffix, selectList) {
      const { time, max, min } = val
      prefix = prefix || ''
      suffix = suffix || ''
      console.log(val, prefix, suffix, selectList)
      const currentValueList = []
      selectList.map(item => {
        val.value.map(v => {
          if (v === item.value) currentValueList.push(item)
        })
      })
      const select = Object.keys(currentValueList)
        .map(i => currentValueList[i].label)
        .join(',')
      const timeShow = !time
        ? false
        : time[0] === time[1]
        ? time[0]
        : `${time[0]} - ${time[1]}`
      const valueShow =
        !max && !min
          ? ''
          : !max && min
          ? `${prefix}${comdify(min)}${suffix} - ?`
          : max && !min
          ? `? - ${prefix}${comdify(max)}${suffix}`
          : min === max
          ? `${prefix}${comdify(min)}${suffix}`
          : `${prefix}${comdify(min)}${suffix} -  ${prefix}${comdify(
              max
            )}${suffix}`

      if (timeShow && valueShow) return `${select}; ${timeShow}; ${valueShow}`
      if (timeShow && !valueShow) return `${select}; ${timeShow}`

      if (!timeShow && valueShow) return `${select}; ${valueShow}`
      if (!timeShow && !valueShow) return `${select}`
    }
  },
  props: {
    filter: {
      type: String,
      default: ''
    },
    filterDate: { type: [Object, Array], default: null },
    filterConfig: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: 'mini'
    },
    selectList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      deviceDialogVisible: false,
      filterTypes: this.filterConfig,
      popoverShow: false,
      valueTypeList: [],
      valueTypeObj: {},
      prefix: {},
      label: {},
      prefixList: [],
      suffix: {},
      suffixList: [],
      filterDateCopy: {},
      comdify: comdify,
      valueType: null
    }
  },
  computed: {
    parseSelectValue() {
      const currentValueList = []
      this.selectList[this.filter].map(item => {
        this.filterDateCopy.value.map(v => {
          if (v === item.value) currentValueList.push(item)
        })
      })
      return Object.keys(currentValueList)
        .map(i => currentValueList[i].label)
        .join(',')
    }
  },
  watch: {
    filterDate(val) {
      this.filterDateCopy = Object.assign({}, val)
    },
    filterConfig: {
      handler(val) {
        if (!val.valueType || !val.valueType.type) this.valueType = null
        else {
          this.valueType = val.valueType.type[this.filter]
            ? val.valueType.type[this.filter]
            : null
        }
      },
      immediate: true,
      deep: true
    }
  },
  updated() {
    this.$emit('update')
  },
  created() {
    this.filterDateCopy = Object.assign({}, this.filterDate)
    const valueType = Object.assign({}, this.filterConfig.valueType)
    this.prefixList = valueType.prefix ? Object.keys(valueType.prefix) : []
    this.suffixList = valueType.suffix ? Object.keys(valueType.suffix) : []
    const labelList = valueType.label ? Object.keys(valueType.label) : []
    this.prefix = valueType.prefix ? valueType.prefix : {}
    //
    this.suffix = valueType.suffix ? valueType.suffix : {}
    this.label = valueType.label ? valueType.label : {}

    this.valueTypeList = [...this.prefixList, ...this.suffixList, ...labelList]
  },
  methods: {
    HandleReference() {
      const refs = Object.keys(this.$parent.$refs)
      const filters = refs.map(item => this.$parent.$refs[item][0])
      filters.map(item => {
        if (item && item.popoverShow !== 'undefined') item.popoverShow = false
      })

      this.popoverShow = !this.popoverShow
    },
    deleteFilterItem() {
      this.$emit('deleteFilter', this.filter)
    },
    showDevice() {
      this.$emit('deviceDialog', true)
    },
    showLabels() {
      this.$emit('labelDialog', true)
    },
    handlePopoverStatus(formData) {
      this.popoverShow = false
      this.filterDateCopy = formData
      this.$emit('filterDateChange', this.filter, formData)
    },
    handleTimeSetDate(flag, value) {
      this.popoverShow = false
      this.filterDateCopy = value
      this.$emit('filterDateChange', flag, value)
    },
    clear(data) {
      this.$refs[`value-${this.filter}`].formDataSelf = data
    }
  }
}
</script>
