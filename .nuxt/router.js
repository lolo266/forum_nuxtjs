import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _22d93d60 = () => interopDefault(import('..\\pages\\forum.vue' /* webpackChunkName: "pages_forum" */))
const _457b4b22 = () => interopDefault(import('..\\pages\\forum\\index.vue' /* webpackChunkName: "pages_forum_index" */))
const _76ea9f1f = () => interopDefault(import('..\\pages\\forum\\admin.vue' /* webpackChunkName: "pages_forum_admin" */))
const _389514e7 = () => interopDefault(import('..\\pages\\forum\\latest.vue' /* webpackChunkName: "pages_forum_latest" */))
const _15acf288 = () => interopDefault(import('..\\pages\\forum\\search.vue' /* webpackChunkName: "pages_forum_search" */))
const _4da2907b = () => interopDefault(import('..\\pages\\forum\\topic\\create.vue' /* webpackChunkName: "pages_forum_topic_create" */))
const _e5f5332a = () => interopDefault(import('..\\pages\\forum\\category\\_link.vue' /* webpackChunkName: "pages_forum_category__link" */))
const _4499f5c6 = () => interopDefault(import('..\\pages\\forum\\child\\_link.vue' /* webpackChunkName: "pages_forum_child__link" */))
const _b18f19ac = () => interopDefault(import('..\\pages\\forum\\topic\\_link.vue' /* webpackChunkName: "pages_forum_topic__link" */))
const _2a354c84 = () => interopDefault(import('..\\pages\\user\\_name.vue' /* webpackChunkName: "pages_user__name" */))
const _787b9891 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/forum",
    component: _22d93d60,
    children: [{
      path: "",
      component: _457b4b22,
      name: "forum"
    }, {
      path: "admin",
      component: _76ea9f1f,
      name: "forum-admin"
    }, {
      path: "latest",
      component: _389514e7,
      name: "forum-latest"
    }, {
      path: "search",
      component: _15acf288,
      name: "forum-search"
    }, {
      path: "topic/create",
      component: _4da2907b,
      name: "forum-topic-create"
    }, {
      path: "category/:link?",
      component: _e5f5332a,
      name: "forum-category-link"
    }, {
      path: "child/:link?",
      component: _4499f5c6,
      name: "forum-child-link"
    }, {
      path: "topic/:link?",
      component: _b18f19ac,
      name: "forum-topic-link"
    }]
  }, {
    path: "/user/:name?",
    component: _2a354c84,
    name: "user-name"
  }, {
    path: "/",
    component: _787b9891,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
