<template>
  <div class="sst-filter" :class="effect">
    <div>
      <slot name="prefix" />
      <el-popover
        v-model="popoverShow"
        placement="bottom"
        width="230"
        trigger="click"
      >
        <filter-option
          :select-options="selectList"
          :data-list="Array.isArray(options) ? options : Object.keys(options)"
          @change="handlerFilterOptionChange"
        />
        <el-button slot="reference" type="text">
          More Filter(s)
          <i
            :class="popoverShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          />
        </el-button>
      </el-popover>
    </div>

    <div
      v-if="Array.isArray(options) && selectList.length"
      class="filter-container"
    >
      <el-checkbox-group v-model="selectList">
        <el-checkbox v-for="item in selectList" :key="item" :label="item" />
      </el-checkbox-group>
    </div>

    <div
      v-if="!Array.isArray(options) && selectList.length"
      class="filter-container"
    >
      <div v-for="(item, index) in selectList" :key="index" class="filter-item">
        <slot :name="item" :scope="options[item]">
          <filter-popover
            :name="item"
            :templates="options[item].template || []"
            :data="options[item].data || {}"
            :options="options[item].config || {}"
            :format="
              options[item].config && options[item].config.format
                ? options[item].config.format
                : val => val
            "
          />
        </slot>
        <span class="delete__icon" @click="handlerDeleteItem(index)"
          ><i class="el-icon-circle-close" title="Delete Item"
        /></span>
      </div>
    </div>
  </div>
</template>

<script>
import FilterOption from './filter-option'
import FilterPopover from './filter-popover'

export default {
  name: 'SstFilter2',
  components: { FilterOption, FilterPopover },
  props: {
    effect: { type: String, default: 'light' },
    options: { type: [Object, Array], default: () => ({}) },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      popoverShow: false,
      selectList: this.selectedList || []
    }
  },
  methods: {
    getSelectDate() {
      if (Array.isArray(this.options)) {
        return this.selectList
      } else {
        let result = {}
        Object.keys(this.options)
          .filter(k => this.selectList.includes(k))
          .forEach(k => {
            result[k] = this.options[k].data
          })
        return result
      }
    },
    handlerDeleteItem(index) {
      this.selectList.splice(index, 1)
    },
    handlerFilterOptionChange(selectList) {
      this.selectList = selectList
      this.$emit('optionChange', this.selectList)
    }
  }
}
</script>

<style lang="scss">
@import 'filter.scss';
</style>
