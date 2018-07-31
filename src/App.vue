<template>
  <div id="app">
    <el-menu
      class="nav-top clearfix"
      mode="horizontal"
      color-format="hsv"
      active-text-color="#ffd04b"
      :text-color="fontColor"
      :background-color="bgColor"
      :default-active="activeIndex"
      @select="handleSelect">
      <el-menu-item
        index="0"
        @click="$router.push({name: 'home'})">
        <img src="./assets/icon/logo.png">
        <span> Sinoyd — 问卷系统</span>
      </el-menu-item>
      <!-- <el-menu-item
        index="1">问卷列表
      </el-menu-item> -->
      <el-menu-item index="2">
        <el-color-picker
          v-model="bgColor"
          size="mini">
        </el-color-picker>
      </el-menu-item>
      <el-menu-item
        v-if="!loginStatus"
        index="3">登录
      </el-menu-item>
      <el-submenu
        v-if="loginStatus"
        index="3">
        <template slot="title">欢迎, {{ loginType ? adminInfo.name : userInfo.username }}</template>
        <el-menu-item v-if="!loginType" index="3-1">更换卷码
          <span style="color: #ccc" class="fr">{{ userInfo.code }}</span>
        </el-menu-item>
        <el-menu-item index="3-2">退出</el-menu-item>
      </el-submenu>
    </el-menu>
    <!-- 登录表单弹框 -->
    <DialogForm/>
    <router-view/>
  </div>
</template>

<script>
import DialogForm from '@/components/DialogForm'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    DialogForm
  },
  created () {
    if (!this.adminInfo) {
      let admin = this.$utils.getCache('admin')
      let nowTime = new Date().getTime()
      if (admin) {
        if (nowTime - admin.time < 2 * 60 * 60 * 1000) {
          this.setAdminInfo(admin)
        } else {
          localStorage.removeItem('admin')
        }
      }
    }
    if (!this.userInfo) {
      let user = this.$utils.getCache('user')
      if (user) {
        this.setUserInfo(user)
      }
    }
    if (this.tokenTime > 90 && this.tokenTime < 120) {
      this.refreshToken()
    }
  },
  data () {
    return {
      activeIndex: '1',
      bgColor: '#1E1F1C'
    }
  },
  computed: {
    fontColor () {
      return this.$utils.rgbToHsl(this.$utils.hexToRgb(this.bgColor))[2] > 127 ? '#000' : '#fff'
    },
    ...mapState(['adminInfo', 'userInfo', 'activePage']),
    ...mapGetters(['tokenTime', 'loginStatus', 'loginType'])
  },
  methods: {
    handleSelect (key) {
      switch (key) {
        case '3':
          this.setFormType(true)
          this.setDialogForm(true)
          break
        case '3-1':
          this.changeCode()
          break
        case '3-2': this.logout()
          break
      }
    },
    // 刷新 token
    refreshToken () {
      this.$http.post('refresh-token')
        .then(result => {
          this.setToken(result.headers.authorization, result.headers.date)
          this.$utils.setCache('admin', this.adminInfo)
        }, error => {
          console.log(error)
          this.logout()
        })
    },
    // 注销
    logout () {
      if (this.loginType) {
        this.$http.delete('logout')
        this.setAdminInfo('') // 清空用户状态信息
        localStorage.removeItem('admin') // 清空本地缓存
      } else {
        this.setUserInfo('')
        localStorage.removeItem('user')
      }
      this.$router.push({ name: 'home' })
    },
    changeCode () {
      if (this.activePage !== 'survey') {
        this.$prompt('请输入卷码', {
          confirmButtonText: '确定更换',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+[-]+[a-zA-Z0-9]{9,}$/,
          inputErrorMessage: '卷码格式不正确',
          inputPlaceholder: this.userInfo.code
        }).then(({ value }) => {
          this.setSurveyCode(value)
          this.$message({
            type: 'success',
            message: '卷码已更新'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '答卷期间无法更换卷码'
        })
      }
    },
    ...mapMutations([
      'setDialogForm',
      'setDialogHint',
      'setLoginStatus',
      'setAdminInfo',
      'setUserInfo',
      'setFormType',
      'setSurveyCode'
    ])
  }
}
</script>

<style lang="less">
  @import './style/common';
  @import './style/mixin';
  .nav-top {
    > li:not(:nth-last-child(n + 3)) {
      float: right;
    }
    span.code {
      color: #ccc !important;
    }
  }
</style>
