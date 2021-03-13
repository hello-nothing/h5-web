import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import vuex from '@/store/index';
import Lawyer from './views/lawyer.vue'
import Office from './views/office.vue'
import Service from './views/service.vue'
import ListDetail from './views/list-detail.vue'
import DetailMessage from './views/detail-message.vue'

Vue.use(Router)

// export default new Router({
const routes = [
  {
    path: '/index',
    name: 'index',
    component: Index,
    meta: {
      navName: 'index',
      title: '上海市律师行业信用信息服务平台',
    }
  },
  {
    path: '/lawyer',
    name: 'lawyer',
    component: Lawyer,
    meta: {
      navName: 'lawyer',
      title: '上海市律师行业信用信息服务平台',
      keepAlive: true,//此组件需要被缓存
    }
  },
  {
    path: '/office',
    name: 'office',
    component: Office,
    meta: {
      navName: 'office',
      title: '上海市律师行业信用信息服务平台',
      keepAlive: true,//此组件需要被缓存
    }
  },
  {
    path: '/service',
    name: 'service',
    component: Service,
    meta: {
      navName: 'service',
      title: '上海市律师行业信用信息服务平台',
    }
  },
  {
    path: '/ListDetail',
    name: 'ListDetail',
    component: ListDetail,
  },
  {
    path: '/DetailMessage',
    name: 'DetailMessage',
    component: DetailMessage,
  },
]

// });
let router = new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return {
        x: 0,
        y: 0
      };
    } else {
      return savedPosition;
    }
  }
});
export default router;
router.afterEach((to, from) => {
  ctrlTabBar(to, from);
});

function ctrlTabBar(to, from) {
  if (to.meta.navName) {
    //需要navBar的页面
    vuex.dispatch('AgettabberSwite', true);
    vuex.dispatch('AgetnavbarText', to.meta.navName);
  } else {
    vuex.dispatch('AgettabberSwite', false);
  }
  if (to.meta.title) {
    // 含有标题栏
    document.title = to.meta.title;
  }
}
