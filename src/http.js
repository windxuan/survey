import axios from 'axios'
import store from './store'
import utils from './utils'

// 真实接口
// axios.defaults.baseURL = 'http://192.168.6.163:8080/api/'

// 开发接口(已设置代理)
axios.defaults.baseURL = '/api/'

// 模拟接口
// axios.defaults.baseURL = 'https://easy-mock.com/mock/5b30ed91a682e4291a270142/evaluate/api/'

// 创建取消请求令牌
let CancelToken = axios.CancelToken
let source = CancelToken.source()

// // 存储每个请求的取消函数和标识
// let pending = []
// let removePending = (config, fn) => {
//   // 缓存请求标识
//   let flagUrl = config.url
//   // 当标识已存在时
//   if (pending.indexOf(flagUrl) !== -1) {
//     // 取消请求
//     if (fn) {
//       fn() // 执行取消操作
//     } else {
//       // 把这条记录从数组中移除
//       pending.splice(pending.indexOf(flagUrl), 1)
//     }
//   } else {
//     if (fn) {
//       pending.push(flagUrl)
//     }
//   }
// }

// 请求拦截 - 附加凭证
axios.interceptors.request.use(
  config => {
    // 排除 url/generate
    if (!config.url.match('url/generate')) {
      // 重复请求下取消本次请求
      // config.cancelToken = new CancelToken((callback) => {
      //   removePending(config, callback)
      // })
    }
    // 当存在 token 且未过期
    if (store.getters.loginType && store.getters.tokenTime < 120) {
      if (config.url.match('refresh-token') || config.url.match('url/generate') || config.url.match('survey/summary')) {
        config.headers.Authorization = `Bearer ${store.state.adminInfo.token}`
      }
    } else {
      // 过期弹出登录框
      // store.commit('setDialogForm', true)
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截 - 处理返回的数据结构
axios.interceptors.response.use(
  result => {
    // removePending(result.config)
    if (result.config.method === 'get') {
      // 问卷数据处理
      if (result.config.url.match('survey/url')) {
        return converSurvey(result.data)
      }

      // 处理汇总数据
      if (result.config.url.match('survey/summary')) {
        return converSummary(result.data)
      }
    }
    return result
  },
  err => {
    // pending = []
    return Promise.reject(err)
  }
)

/**
 * 问卷数据转换
 * @param {object} data 原始响应数据
 */
function converSurvey (data) {
  let tempData = data.questions
  tempData.forEach(element => {
    element.options.forEach(ele => {
      ele.firstCode = 0
    })
  })
  return tempData
}

/**
 * 汇总数据转换
 * @param {object} data 原始响应数据
 */
function converSummary (data) {
  let tempData = []
  const arr = []
  const map = new Map()
  data.forEach(element => {
    map.set(element.staff_id, [])
  })
  data.forEach(element => {
    map.get(element.staff_id).push({
      staff: element.staff,
      code: element.code,
      score: element.score,
      survey: element.survey
    })
  })
  var promise = new Promise(resolve => {
    for (var [key, val] of map) {
      arr.push([key, val, utils.createTag(val)])
    }
    resolve(arr)
  })
  promise.then(reuslt => {
    reuslt.forEach(element => {
      if (element[1].length === 9) {
        tempData.push(element)
      }
      if (element[1].length === 10) {
        element[1].splice(0, 1)
        tempData.push(element)
      }
    })
  })
  return tempData
}

// 定义请求实例
axios.create({
  timeout: 5000,
  cancelToken: source.token,
  // 跨域方案 B
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET'
  }
})

export default axios
