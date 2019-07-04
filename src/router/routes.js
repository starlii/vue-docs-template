import navConfig from '@/nav.config.json'

const load = function(lang, path) {
  return LOAD_MAP[lang](path)
}

const loadDocs = function(lang, path) {
  return LOAD_DOCS_MAP[lang](path)
}

const LOAD_MAP = {
  'zh-CN': name => {
    return r =>
      require.ensure([], () => r(require(`@/views/zh-CN/${name}.vue`)), 'zh-CN')
  }
}

const LOAD_DOCS_MAP = {
  'zh-CN': path => {
    return r =>
      require.ensure([], () => r(require(`@/views/zh-CN${path}.md`)), 'zh-CN')
  }
}

const registerRoute = navConfig => {
  let route = []
  Object.keys(navConfig).forEach((lang, index) => {
    let navs = navConfig[lang]
    route.push({
      path: `/${lang}/component`,
      redirect: `/${lang}/component/installation`,
      component: load(lang, 'component'),
      children: []
    })
    navs.forEach(nav => {
      if (nav.href) return
      if (nav.groups) {
        nav.groups.forEach(group => {
          group.list.forEach(nav => {
            addRoute(nav, lang, index)
          })
        })
      } else if (nav.children) {
        nav.children.forEach(nav => {
          addRoute(nav, lang, index)
        })
      } else {
        addRoute(nav, lang, index)
      }
    })
  })
  function addRoute(page, lang, index) {
    const component = loadDocs(lang, page.path)
    let child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
        lang
      },
      name: 'component-' + lang + (page.title || page.name),
      component: component.default || component
    }

    route[index].children.push(child)
  }

  return route
}

let route = registerRoute(navConfig)

const generateMiscRoutes = function(lang) {
  // let guideRoute = {
  //   path: `/${lang}/guide`, // 指南
  //   redirect: `/${lang}/guide/design`,
  //   component: load(lang, 'guide'),
  //   children: [
  //     {
  //       path: 'design', // 设计原则
  //       name: 'guide-design' + lang,
  //       meta: { lang },
  //       component: loadDocs(lang, '/design')
  //     },
  //     {
  //       path: 'nav', // 导航
  //       name: 'guide-nav' + lang,
  //       meta: { lang },
  //       component: loadDocs(lang, '/nav')
  //     }
  //   ]
  // }

  let indexRoute = {
    path: `/${lang}`, // 首页
    meta: { lang },
    name: 'home' + lang,
    component: load(lang, 'index')
  }

  return [indexRoute]
}

route = route.concat(generateMiscRoutes('zh-CN'))

let defaultPath = '/zh-CN'
route = route.concat([
  {
    path: '/',
    redirect: defaultPath
  },
  {
    path: '*',
    redirect: defaultPath
  }
])

export default route
