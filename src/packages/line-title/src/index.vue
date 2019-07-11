<template>
  <div class="line-tpl">
    <div
      class="line-tpl__text"
      :class="isTitle ? 'isTitle' : ''"
      :style="{ transform: `translate(${left}px,-50%)` }"
    >
      {{ title }}
    </div>
    <div class="line-tpl__line" />
  </div>
</template>

<script>
export default {
  name: 'SstLineTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    isTitle: {
      type: Boolean,
      default: true
    },
    left: {
      type: Number,
      default: 25
    }
  }
}
</script>

<style lang="scss">
.line-tpl {
  padding: 10px 0;
  position: relative;
  .line-tpl__line {
    border-top: 1px solid rgba(204, 204, 204, 0.3);
    width: 100%;
  }
  .line-tpl__text {
    position: absolute;
    background-color: #fff;
    &.isTitle {
      font-size: 14px;
      font-weight: bold;
    }
  }

  /*.text{transform:translateY(10px)}*/
}
</style>
