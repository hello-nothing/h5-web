import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

let apiList = Vue.axios.create({
  method: 'GET',
  baseURL: '/service/'
})
let apiResource = Vue.axios.create({
  method: 'POST',
  baseURL: '/service/'
})

let apiSend = Vue.axios.create({
  method: 'POST',
  baseURL: '/api/'
})

export default {
  getList: (opts) => {
    return apiList({
      url: '/rest/12348.JBH/collection/searchJBHNews',
      params: {
        ...opts
      }
    })
  },
  // 获取区县
  getArea: (opts) => {
    return apiList({
      url: '/rest/lpp.ExSubjectService/Collection/zoneCodeDic',
      params: {
        ...opts
      }
    })
  },
  // 获取业务领域
  getBussiness: (opts) => {
    return apiList({
      url: '/rest/lpp.ExSubjectService/Collection/practiceScopeDic',
      params: {
        ...opts
      }
    })
  },
  // 获取组织形式
  getOrgType:(opts) => {
    return apiList({
      url:'/rest/lpp.ExSubjectService/Collection/lawFirmTypeDic',
      params: {
        ...opts
      }
    })
  },
  // 获取律师信息列表
  getLawyerList:(opts) => {
    return apiList({
      url:'/rest/lpp.ExSubjectService/Collection/lawyerList',
      params: {
        ...opts
      }
    })
  },
   // 获取律所信息列表
   getOfficeList:(opts) => {
    return apiList({
      url:'/rest/lpp.ExSubjectService/Collection/lawFirmList',
      params: {
        ...opts
      }
    })
  },
  // 获取律师详细信息列表
  getLawyerDetail:(opts) => {
    return apiList({
      url:'/rest/lpp.ExSubjectService/' + opts + '/lawyerDetail',
    })
  },
  // 获取律所详细信息列表
  getOfficeDetail:(opts) => {
    return apiList({
      url:'/rest/lpp.ExSubjectService/' + opts + '/lawyFirmDetail',
    })
  },
}