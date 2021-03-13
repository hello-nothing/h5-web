// import * as types from '../mutation-types'
import api from '@/api/index'
const state = {
  navbarText: 'index', // nabver 名称
  tabberSwite: false, // tabber 开关
}

const getters = {
  navbarText: state => state.navbarText,
  tabberSwite: state => state.tabberSwite,
}

const actions = {
  AgetnavbarText({
    commit
  }, inner) {
    // navbar
    commit('getnavbarText', inner);
  },
  AgettabberSwite({
    commit
  }, inner) {
    // 改tabber
    commit('gettabberSwite', inner);
  }
}

const mutations = {
  getnavbarText(state, inner) {
    state.navbarText = inner;
  },
  gettabberSwite(state, inner) {
    state.tabberSwite = inner;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
