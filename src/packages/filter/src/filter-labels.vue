<template>
  <section>
    <div class="condition flex-column-center">
      <el-input
        :size="size"
        class="input-lgest"
        suffix-icon="iconfont icon-searchplus primaryText"
      />
      <el-checkbox-group style="margin-top: 10px">
        <el-checkbox label="OOS" />
        <el-checkbox label="Sold" />
        <el-checkbox label="PO" />
        <el-checkbox label="eBay" />
        <el-checkbox label="Admin" />
      </el-checkbox-group>
    </div>
    <div class="selected-label">
      <sst-line-title
        class="info"
        title="Selected Labels"
        :left="30"
        :is-title="false"
      >
        <el-radio-group slot="fix" v-model="relation">
          <el-radio label="and">And</el-radio>
          <el-radio label="or">Or</el-radio>
        </el-radio-group>
      </sst-line-title>
      <div class="label-container">
        <div
          v-for="label in labels"
          :key="label.name"
          class="label-item regularText"
        >
          <div class="label-name">{{ label.shortName }}</div>
          <div>({{ label.itemCount }})</div>
          <i class="delete-icon el-icon-close danger pointer" />
        </div>
      </div>
    </div>
    <div class="search-label">
      <sst-line-title
        class="info"
        title="Search Results"
        :left="30"
        :is-title="false"
      />
      <div class="label-container">
        <div
          v-for="label in labels"
          :key="label.name"
          class="label-item regularText pointer"
          @click="HandleSelectLabel"
        >
          <div class="label-name">{{ label.shortName }}</div>
          <div>({{ label.itemCount }})</div>
        </div>
      </div>
    </div>
    <div class="center">
      <el-button :size="size" type="primary" @click="confirm">OK</el-button>
      <el-button :size="size" @click="cancel">Cancel</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FilterLabels',
  props: {
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      relation: 'and',
      labels: [
        { shortName: '2332', itemCount: 12 },
        { shortName: '23132', itemCount: 12 },
        { shortName: '232332', itemCount: 12 },
        { shortName: '23432', itemCount: 12 },
        { shortName: '235632', itemCount: 12 },
        { shortName: '237832', itemCount: 12 },
        { shortName: '23532', itemCount: 12 },
        { shortName: '232732', itemCount: 12 }
      ]
    }
  },
  created() {
    // TODO:  有数据时，取消注释
    // this.labels = Object.assign([], this.labelsDate)
  },
  methods: {
    HandleSelectLabel() {},
    confirm() {
      this.$emit('closeDialog', 'label', this.labels)
    },
    cancel() {}
  }
}
</script>

<style scoped></style>
