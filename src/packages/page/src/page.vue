<template>
  <div class="sst-page">
    <div class="page-title">
      <slot name="page-title" />
    </div>
    <!--default slot-->
    <div class="page-content"><slot /></div>
    <div class="page-footer">
      <slot name="page-footer" />

      <el-pagination
        v-if="pagination && !$slots.pageFooter"
        :current-page="pageNum"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SstPage',
  props: {
    pagination: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    tHeight: { type: Number, default: 0 },
    pageSizes: {
      type: Array,
      default: () => [30, 60, 90, 120]
    }
  },
  data() {
    return {
      pageSize: 30,
      pageNum: 1,
      cHeight: 0
    }
  },
  watch: {
    cHeight: {
      handler(val) {
        this.$emit(
          'update:tHeight',
          val -
            this.$el.children[0].clientHeight -
            this.$el.children[2].clientHeight -
            1
        )
      }
    }
  },
  updated() {
    window.onresize = () => {
      console.log('onresize')
      this.cHeight = this.$el.clientHeight
    }
    this.$emit(
      'update:tHeight',
      this.$el.clientHeight -
        this.$el.children[0].clientHeight -
        this.$el.children[2].clientHeight -
        1
    )
  },
  created() {
    this.$nextTick(() => {
      this.$emit(
        'update:tHeight',
        this.$el.clientHeight -
          this.$el.children[0].clientHeight -
          this.$el.children[2].clientHeight -
          1
      )
    })
  },
  mounted() {
    window.onresize = () => {
      this.cHeight = this.$el.clientHeight
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$emit('page-change', this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.$emit('page-change', this.pageSize, this.pageNum)
    }
  }
}
</script>

<style lang="scss" scoped>
.sst-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .page-content {
    flex: 1;
  }
  .page-footer {
    height: 32px;
    text-align: center;
  }
}
</style>
