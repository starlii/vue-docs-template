import Vue from 'vue'
import Router from 'vue-router'
import hljs from 'highlight.js'
import routes from './routes'

console.log('routes', routes)

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes
})

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  })
})
export default router
