<template>
  <div id="app" :class="{ 'is-component': isComponent }">
    <main-header />
    <div class="main-cnt">
      <router-view />
    </div>
    <main-footer v-if="!isComponent" />
  </div>
</template>
<script>
import MainHeader from '@/components/main-header'
import MainFooter from '@/components/main-footer'
export default {
  components: { MainHeader, MainFooter },
  data() {
    return {
      msg: 'heelo world'
    }
  },
  computed: {
    isComponent() {
      return /^component/.test(this.$route.name || '')
    }
  }
}
</script>
