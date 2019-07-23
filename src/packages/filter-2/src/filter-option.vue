<template>
  <div>
    <div>
      <a
        href="javascript:;"
        class="sst-filter__link"
        style="line-height: 2.5;"
        @click="handleAll"
        >Select/Unselect All</a
      >
    </div>
    <div class="sst-filter__content">
      <el-divider v-if="selectedList.length" content-position="left">
        Selected Filter(s)
      </el-divider>
      <span class="info" />
      <el-checkbox-group
        v-model="selectedList"
        style="margin-top: 10px"
        @change="handleSelect"
      >
        <div class="filter-select-group">
          <div v-for="option in selectedItems" :key="option">
            <el-checkbox :label="option" />
          </div>
        </div>
      </el-checkbox-group>
      <div>
        <el-divider content-position="left">All Filter(s)</el-divider>
        <span v-if="notSelectedItems.length" class="info" />
        <el-checkbox-group v-model="notSelectedList" @change="handlerNotSelect">
          <div class="filter-select-group">
            <div v-for="option in notSelectedItems" :key="option">
              <el-checkbox :label="option" />
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <span v-if="!notSelectedItems.length" class="selections-tip label-color"
        >All selected</span
      >
    </div>
  </div>
</template>

<script>
import { difference, concat } from 'lodash'
export default {
  name: 'FilterOption',
  props: {
    selectOptions: { type: Array, default: () => [] },
    dataList: { type: Array, default: () => [] }
  },
  data() {
    return {
      notSelectedList: [],
      notSelectedItems: [],
      selectedList: [],
      selectedItems: [],
      hasSelectAll: false
    }
  },
  watch: {
    selectOptions: {
      handler(val) {
        this.notSelectedItems = difference(this.dataList, val)
        this.selectedList = this.selectedItems = Object.assign([], val)
        if (this.dataList.length === val.lenght) {
          this.hasSelectAll = true
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleSelect(value) {
      this.hasSelectAll = false
      this.notSelectedItems = difference(this.dataList, value)
      this.notSelectedList = []
      this.selectedItems = value
      this.selectedList = value

      this.$emit('change', this.selectedList)
    },
    handlerNotSelect(value) {
      this.notSelectedItems = difference(this.notSelectedItems, value)
      this.selectedItems = [...new Set(concat(this.selectedList, value))]
      this.selectedList = [...new Set(concat(this.selectedList, value))]
      if (this.notSelectedItems.length) this.hasSelectAll = true
      this.$emit('change', this.selectedList)
    },
    handleAll() {
      if (this.hasSelectAll) {
        this.selectedList = []
        this.selectedItems = []

        this.notSelectedItems = this.dataList
        this.notSelectedList = []
        this.hasSelectAll = false
        this.$emit('change', this.selectedList)
      } else {
        this.notSelectedItems = []
        this.selectedList = this.dataList
        this.selectedItems = this.dataList
        this.hasSelectAll = true
        this.$emit('change', this.selectedList)
      }
    }
  }
}
</script>

<style lang="scss">
.select-label {
  position: absolute;
  top: -9px;
  left: 10px;
  background-color: #fff;
}
.selections-tip {
  text-align: center;
  display: block;
}
.label-color {
  color: #999999;
}
.filter-select-group {
  & > div {
    padding: 5px 10px;
  }
}

.sst-filter__content {
  max-height: 300px;
  overflow-y: auto;
}
</style>
