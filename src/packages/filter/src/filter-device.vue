<template>
  <page>
    <div slot="pageTitle" class="filter-time-container">
      <div>
        <el-input
          v-model.trim="params.brandName"
          style="margin-right: 10px"
          :size="size"
          class="input-lg"
          placeholder="Device Name"
        />
        <el-select
          v-model="params.brandId"
          :size="size"
          filterable
          placeholder="Brand: Select"
          :class="params.brandId ? '' : 'place-holder'"
          @change="brandSelected"
        >
          <el-option class="info" :value="null" :label="'Brand: Select'" />
          <el-option
            v-for="item in deviceBrandList"
            :key="item.itemId"
            :label="item.fullName"
            :value="item.itemId"
          />
        </el-select>
        <el-select
          v-model="params.seriesId"
          :size="size"
          filterable
          placeholder="Series: Select"
          :class="params.seriesId ? '' : 'place-holder'"
          @change="seriesSelected"
        >
          <el-option class="info" :value="null" :label="'Series: Select'" />
          <el-option
            v-for="item in deviceSeriesList"
            :key="item.seriesId"
            :label="item.seriesName"
            :value="item.seriesId"
          />
        </el-select>
        <el-button :size="size" type="warning" @click="searchDevice"
          >Search</el-button
        >
      </div>
      <div class="device-select">
        <span class="page-title">Selected Devices: </span>
        <div v-for="item in selection" :key="item.id" class="device-options">
          <span
            class="device-text"
            :title="item.shortName + '(' + item.itemCount + ')'"
          >
            <span>{{ item.shortName }}</span>
            <span>({{ item.itemCount || 0 }})</span>
          </span>
          <span class="delete-icon-device" @click="deleteDevice(item)">
            X
          </span>
        </div>
      </div>
    </div>
    <el-table
      ref="deviceTable"
      v-loading="loading"
      :size="size"
      border
      :data="deviceBatchList.list"
      :height="400"
      @select-all="handleSelectAll"
      @select="handleSelect"
    >
      <el-table-column
        label="Device Name"
        header-align="center"
        prop="shortName"
      />
      <el-table-column
        label="Brand Name"
        header-align="center"
        prop="fullName"
      />
      <el-table-column label="Item Count" align="center" prop="itemCount" />
      <el-table-column label="On Filter" align="center" prop="onFilter" />
      <el-table-column type="selection" />
    </el-table>
    <div slot="pageFooter" style="text-align: center">
      <el-pagination
        :page-size="params.pageSize"
        :current-page="params.pageNum"
        :page-sizes="[30, 60, 100, 150]"
        layout="total, sizes, prev, pager, next,jumper"
        :total="deviceBatchList.total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
      <div style="text-align: center">
        <el-button :size="size" type="primary" @click="confirm">OK</el-button>
        <el-button :size="size" @click="cancelSelect">Cancel</el-button>
      </div>
    </div>
  </page>
</template>

<script>
export default {
  name: 'FilterDevice',
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    deviceBrandList: {
      type: Array,
      default: () => []
    },
    deviceSeriesList: {
      type: Array,
      default: () => []
    },
    seriesList: {
      type: Array,
      default: () => []
    },
    deviceBatchList: {
      type: Object,
      default: () => {
        return {
          list: [],
          total: null
        }
      }
    },
    deviceDate: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      brandName: null,
      brandId: null,
      seriesId: null,
      loading: false,
      selection: [],
      params: {
        brandName: null,
        brandId: null,
        seriesId: null,
        pageNum: 1,
        pageSize: 30
      },
      currentPageSelection: []
    }
  },
  watch: {
    deviceBatchList: {
      handler(val) {
        this.selection.map(item => {
          const index = this.deviceBatchList.list.findIndex(
            i => i.id === item.id
          )
          setTimeout(() => {
            index >= 0 &&
              this.$refs.deviceTable.toggleRowSelection(val.list[index], true)
          }, 0)
        })
      },
      deep: true
    }
  },
  async created() {
    this.selection = Object.assign([], this.deviceDate)
    this.selection.map(item => {
      const index = this.deviceBatchList.list.findIndex(i => i.id === item.id)
      setTimeout(() => {
        index >= 0 &&
          this.$refs.deviceTable.toggleRowSelection(
            this.deviceBatchList.list[index],
            true
          )
      })
    })
  },
  methods: {
    deleteDevice(item) {
      const index = this.selection.findIndex(i => i === item)
      this.selection.splice(index, 1)
      this.$refs.deviceTable.toggleRowSelection(item, false)
    },
    async brandSelected(val) {
      this.$emit('deviceBrandChange', this.params)
    },
    async seriesSelected(val) {
      this.$emit('deviceSeriesChange', this.params)
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.loadingDeviceList()
    },
    handlePageChange(pageNum) {
      this.params.pageNum = pageNum
      this.loadingDeviceList()
    },
    async loadingDeviceList() {
      this.$emit('devicePageChange', this.params)
    },
    async searchDevice() {
      this.$emit('deviceSearch', this.params)
    },
    handleSelect(selection, row) {
      if (this.selection.findIndex(item => item.id === row.id) < 0) {
        this.selection = [...new Set([...this.selection, row])]
      } else {
        this.selection.splice(
          this.selection.findIndex(item => item.id === row.id),
          1
        )
      }
    },
    handleSelectAll(selection) {
      if (selection.length) {
        this.selection = [...new Set([...this.selection, ...selection])]
      } else {
        this.deviceBatchList.list.forEach((d, idx) => {
          this.selection.forEach((s, index) => {
            if (s.id === d.id) this.selection.splice(index, 1)
          })
        })
      }
    },
    confirm() {
      console.log(JSON.stringify(this.selection))
      this.$emit('closeDialog', 'device', this.selection)
    },
    cancelSelect() {
      this.$refs.deviceTable.clearSelection()
      this.selection = []
    }
  }
}
</script>

<style scoped></style>
