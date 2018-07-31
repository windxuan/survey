import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前页
    activePage: '',
    // 用户信息
    adminInfo: '',
    userInfo: '',
    // 弹框显示
    dialogForm: false,
    dialogHint: true,
    dialogCode: false,
    formType: false,
    // 答卷信息
    surveyId: '',
    // 卷码生成
    createCode: {
      survey_id: 1,
      num: 1,
      code: ''
    }
  },
  getters: {
    // 登录状态
    loginStatus: state => {
      if (state.userInfo || state.adminInfo) {
        return true
      }
    },
    // 登陆类型
    loginType: state => {
      if (state.adminInfo && 'token' in state.adminInfo) {
        return !!(state.adminInfo.token || state.tokenTime)
      }
    },
    // token 时限 - min
    tokenTime: state => {
      if (state.adminInfo && 'time' in state.adminInfo) {
        let time = state.adminInfo.time
        let min = ((new Date().getTime() - time) % (1000 * 60 * 60)) / (1000 * 60)
        return parseInt(min >= 60 ? min + 60 : min)
      }
    }
  },
  mutations: {
    setActivePage (state, value) {
      state.activePage = value
    },
    // 更新 token
    setToken (state, token, nowDate) {
      if (nowDate) {
        state.adminInfo.time = new Date(nowDate).getTime()
      }
      state.adminInfo.token = token
    },
    setAdminInfo (state, value) {
      state.adminInfo = value
    },
    setUserInfo (state, value) {
      state.userInfo = value
    },
    setDialogForm (state, value) {
      state.dialogForm = value
    },
    setDialogHint (state, value) {
      state.dialogHint = value
    },
    setDialogCode (state, value) {
      state.dialogCode = value
    },
    setFormType (state, value) {
      state.formType = value
    },
    setSurveyId (state, value) {
      state.surveyId = value
    },
    setSurveyCode (state, value) {
      state.userInfo.code = value
    },
    setCreateCode (state, keys, value) {
      state.createCode[keys] = value
    }
  }
})
