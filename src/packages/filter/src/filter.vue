<template>
  <div class="sst-filter" :class="effect === 'dark' ? 'dark' : ''">
    <div>
      <slot name="filter-prefix" />
      <span class="btn-container">
        <el-button
          v-if="searchShow"
          :size="size"
          type="warning"
          @click="handleSearch"
          >Search</el-button
        >
        <el-button v-if="resetShow" :size="size" @click="handleReset"
          >Reset</el-button
        >
        <slot name="filter-button" />
      </span>
      <el-popover placement="bottom" width="230" trigger="click">
        <filter-option
          :key="Math.random()"
          :filter-config="filterConfig"
          :type="filterType"
          :select-options="selectFilter"
          @cancel="handleCancel"
          @select="handleSelect"
          @cancelAll="handleCancelAll"
          @selectAll="handleSelectAll"
        />
        <el-button
          slot="reference"
          :size="size"
          class="sst-filter__btn-more sst-filter__link"
        >
          More Filter(s)
          <i class="iconfont icon-down1 right" />
        </el-button>
      </el-popover>
    </div>
    <div
      v-if="filterType === 'manager' && selectFilter.length"
      class="filter-container"
    >
      <el-checkbox-group v-model="selectFilter" @change="handleManageSelect">
        <el-checkbox v-for="item in selectFilter" :key="item" :label="item" />
      </el-checkbox-group>
    </div>
    <div
      v-if="filterType === 'detail' && selectFilter.length"
      class="filter-container"
    >
      <filter-item
        v-for="filter in selectFilter"
        :ref="filter"
        :key="filter"
        :size="size"
        :filter="filter"
        :filter-config="filterConfig"
        :select-list="selectList"
        :filter-date="filterForm[filter]"
        @deviceDialog="changeDeviceDialog"
        @labelDialog="changeLabelDialog"
        @deleteFilter="handleDeleteFilter"
        @filterDateChange="handleFilterDateChange"
        @update="$emit('update')"
      />
    </div>
    <el-dialog
      v-if="filterType === 'detail'"
      title="Device List"
      :visible.sync="deviceDialogVisible"
      top="2vh"
      width="65%"
    >
      <filter-device
        :size="size"
        :device-date="filterData.Device || []"
        :device-brand-list="deviceBrandList"
        :device-series-list="deviceSeriesList"
        :device-batch-list="deviceBatchList"
        @deviceBrandChange="handleDeviceBrand"
        @deviceSeriesChange="handleDeviceSeries"
        @devicePageChange="handleDevicePage"
        @deviceSearch="handleDeviceSearch"
        @closeDialog="handleClose"
      />
    </el-dialog>
    <el-dialog
      v-if="filterType === 'detail'"
      title="Item Labels"
      :visible.sync="labelsDialogVisible"
      width="40%"
    >
      <filter-labels
        :labels-date="filterData['Item Labels'] || []"
        @closeDialog="handleClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import FilterOption from './filter-option'
import FilterItem from './filter-item'
import FilterDevice from './filter-device'
import FilterLabels from './filter-labels'
import _ from 'lodash'

export default {
  name: 'SstFilter',
  components: {
    FilterOption,
    FilterItem,
    FilterDevice,
    FilterLabels
  },
  props: {
    categoryList: {
      type: Array,
      default: () => []
    },
    deviceBrandList: {
      type: Array,
      default: () => []
    },
    deviceSeriesList: {
      type: Array,
      default: () => []
    },
    deviceBatchList: {
      type: Object,
      default: () => {}
    },
    effect: {
      // bar theme, Accepted Values: light/dark
      type: String,
      default: 'light'
    },
    filterType: {
      type: String,
      default: 'manager'
    },
    filterConfig: {
      type: Object,
      default: () => {}
    },
    filters: {
      type: Array,
      default: () => []
    },
    filterData: {
      type: Object,
      default: () => {}
    },
    searchShow: {
      type: Boolean,
      default: true
    },
    resetShow: {
      type: Boolean,
      default: true
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
      keyWords: null,
      category: null,
      brand: null,
      series: null,
      selectFilter: [],
      deviceDialogVisible: false,
      labelsDialogVisible: false,
      filterForm: {}
    }
  },
  watch: {
    selectFilter(val) {
      if (this.filterType === 'detail') {
        const currentFilter = Object.keys(this.filterForm)
        const notDate = _.difference(val, currentFilter)
        this.initFilterDate(notDate)
        this.$emit('filterChange', val, this.filterForm)
      } else {
        this.$emit('filterChange', val)
      }
      this.$emit('update')
    },
    filterData(val) {
      this.filterForm = Object.assign({}, val)
    },
    filters(val) {
      this.selectFilter = Object.assign([], val)
    }
  },
  created() {
    console.log('this.filterData')
    this.selectFilter = Object.assign([], this.filters)
    this.filterForm = this.filterData
    const _filterConfig = [
      'detail',
      'device',
      'label',
      'reOrder',
      'time',
      'timeAndValue',
      'value',
      'select',
      'selectAndTimeAndValue'
    ]

    _filterConfig.map(item => {
      if (!this.filterConfig[item]) this.filterConfig[item] = []
    })
    if (!this.filterConfig['valueType']) this.filterConfig['valueType'] = {}
  },
  methods: {
    initFilterDate(val, flag = false) {
      val.map(filter => {
        if (this.filterConfig.time.indexOf(filter) >= 0) {
          // this.filterForm[filter] = { time: null, timeReversal: false }
          this.filterForm[filter] = { time: null }
          if (flag) {
            this.$refs[filter][0].filterDateCopy = { time: null }
            this.$refs[filter][0].clear({ time: null })
          }
        }
        if (this.filterConfig.value.indexOf(filter) >= 0) {
          // this.filterForm[filter] = { min: null, max: null, valueReversal: false }
          this.filterForm[filter] = { min: null, max: null }
          if (flag) {
            this.$refs[filter][0].filterDateCopy = { min: null, max: null }
            this.$refs[filter][0].clear({ min: null, max: null })
          }
        }
        if (this.filterConfig.timeAndValue.indexOf(filter) >= 0) {
          // this.filterForm[filter] = { time: null, min: null, max: null, timeReversal: false, valueReversal: false }
          this.filterForm[filter] = { time: null, min: null, max: null }
          if (flag) {
            this.$refs[filter][0].filterDateCopy = {
              time: null,
              min: null,
              max: null
            }
            this.$refs[filter][0].clear({ time: null, min: null, max: null })
          }
        }
        if (this.filterConfig.reOrder.indexOf(filter) >= 0) {
          this.filterForm[filter] = { relation: null, min: null, max: null }
          if (flag) {
            this.$refs[filter][0].filterDateCopy = {
              relation: null,
              min: null,
              max: null
            }
            this.$refs[filter][0].clear({
              relation: null,
              min: null,
              max: null
            })
          }
        }
        if (this.filterConfig.select.indexOf(filter) >= 0) {
          this.filterForm[filter] = { value: [] }
          if (flag) {
            this.$refs[filter][0].filterDateCopy = { value: null }
            this.$refs[filter][0].clear({ value: [] })
          }
        }
        if (this.filterConfig.selectAndTimeAndValue.indexOf(filter) >= 0) {
          this.filterForm[filter] = {
            value: [],
            time: null,
            min: null,
            max: null
          }
          if (flag) {
            this.$refs[filter][0].filterDateCopy = {
              value: [],
              time: null,
              min: null,
              max: null
            }
            this.$refs[filter][0].clear({
              value: [],
              time: null,
              min: null,
              max: null
            })
          }
        }
        if (this.filterConfig.device.indexOf(filter) >= 0) {
          this.filterForm[filter] = []
          if (flag) {
            // this.$refs[filter][0].filterDateCopy = []
            // this.$refs[filter][0].clear([])
          }
        }
        if (this.filterConfig.label.indexOf(filter) >= 0) {
          this.filterForm[filter] = []
          if (flag) {
            // this.$refs[filter][0].filterDateCopy = {}
            // this.$refs[filter][0].clear({})
          }
        }
      })
    },

    handleSearch() {
      this.$emit('search', this.filterForm)
    },
    getData(filter) {
      return filter ? this.filterForm[filter] : this.filterForm
    },
    handleReset() {
      if (this.filterType === 'manager') {
        this.selectFilter = []
      }
      if (this.filterType === 'detail') {
        this.initFilterDate(this.selectFilter, true)
      }
      this.$emit('reset', this.filterForm)
    },
    handleCancel(val) {
      console.log('handleCancel', val)
      this.selectFilter = val

      const item = _.difference(Object.keys(this.filterForm), val)
      delete this.filterForm[item]
    },
    handleSelect(val) {
      this.selectFilter = [...new Set(_.concat(val, this.selectFilter))]
    },
    handleCancelAll() {
      this.selectFilter = []
      this.filterForm = {}
    },
    handleSelectAll(val) {
      this.selectFilter = val
    },
    handleManageSelect(value) {
      this.selectFilter = value
    },

    changeDeviceDialog(val) {
      this.deviceDialogVisible = val
    },
    changeLabelDialog(val) {
      this.labelsDialogVisible = val
    },

    handleClose(flag, value) {
      if (flag === 'device') {
        console.log(flag, value)
        this.deviceDialogVisible = false
        this.filterForm.Device = value
      }
      if (flag === 'label') {
        console.log(flag, value)
        this.labelsDialogVisible = false
        this.filterForm['Item Labels'] = value
      }
    },

    handleDeleteFilter(filter) {
      delete this.filterForm[filter]
      this.selectFilter.splice(this.selectFilter.indexOf(filter), 1)
    },

    // 接收 device 页面的 事件
    handleDeviceBrand(params) {
      this.$emit('deviceBrandChange', params)
    },
    handleDeviceSeries(params) {
      this.$emit('deviceSeriesChange', params)
    },
    handleDevicePage(params) {
      this.$emit('devicePageChange', params)
    },
    handleDeviceSearch(params) {
      this.$emit('deviceSearch', params)
    },

    handleFilterDateChange(flag, value) {
      this.filterForm[flag] = value
      this.$emit('detailChange', flag, this.filterForm[flag], this.filterForm)
    },
    getFilterData() {
      return this.filterForm
    }
  }
}
</script>

<style lang="scss">
@import 'filter.scss';
</style>
