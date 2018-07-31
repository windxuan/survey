<template>
  <el-dialog
    :title="formType ? '管理登录' : '请填写基本信息'"
    :visible="dialogForm"
    @close="closeDialog('ruleForm')">
    <!-- 用户信息表单 -->
    <el-form
      v-if="!formType"
      ref="ruleForm"
      :model="form"
      :rules="rules">
      <el-form-item prop="staff_no">
        <el-input
          v-model.number="form.staff_no"
          clearable>
          <template slot="prepend">工号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          clearable>
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="form.code"
          type="text"
          clearable
          @keyup.enter.native="submitForm('ruleForm')">
          <template slot="prepend">卷码</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-switch
          v-model="form.sex"
          active-color="#FF4949"
          inactive-color="#409EFF"
          active-text="女"
          inactive-text="男">
        </el-switch>
      </el-form-item>
    </el-form>

    <!-- 管理登录表单 -->
    <el-form
      v-if="formType"
      ref="ruleForm"
      :model="form"
      :rules="rules">
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          clearable>
          <template slot="prepend">账号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          @keyup.enter.native="submitForm('ruleForm')">
          <template slot="prepend">密码</template>
        </el-input>
      </el-form-item>
    </el-form>

    <p v-if="message" style="color:red">{{message}}</p>
    <div slot="footer" class="dialog-footer">
      <el-button
        class="fl"
        type="warning"
        plain
        @click="resetForm('ruleForm')">重置表单
      </el-button>
      <el-button @click="setDialogForm(false)">取 消</el-button>
      <el-button
        type="primary"
        :disabled="disabled"
        @click="submitForm('ruleForm')">{{ formType ? '登录' : '提交'}}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'DialogForm',
  data () {
    return {
      message: false,
      disabled: false,
      // 表单信息
      form: {
        username: null,
        password: null,
        staff_no: null,
        code: '',
        sex: false
      },
      // 表单验证
      rules: {
        staff_no: [
          { required: true, message: '工号不能为空', trigger: 'blur' },
          { type: 'number', message: '工号必须为数字值', trigger: ['change', 'blur'] }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '卷码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value.match(/^[0-9]+[-]+[a-zA-Z0-9]{9,}$/)) {
                callback(new Error('卷码格式错误'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {

  },
  computed: {
    ...mapState([
      'loginStatus',
      'dialogForm',
      'adminInfo',
      'userInfo',
      'formType',
      'surveyId'
    ])
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.message = false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formType) {
            // 管理
            this.sendLogin()
          } else {
            // 员工， 验证码
            this.checkCode()
          }
        } else {
          return false
        }
      })
    },
    checkCode () {
      this.$http.get('survey/url' + this.form.code)
        .then(result => {
          // 有效卷码
          this.setUserInfo({
            staff_no: this.form.staff_no,
            username: this.form.username,
            sex: this.form.sex ? '女' : '男',
            code: this.form.code
          })
          this.setSurveyId(this.form.code.split('-')[0])
          this.$utils.setCache('user', this.userInfo)
          this.$utils.setCache('survey-' + this.surveyId, result)
          this.setDialogForm(false)
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.message = '卷码已失效，请联系管理员重新获取'
          }
          return false
        })
    },
    sendLogin () {
      this.disabled = true
      this.$http.post('login', {
        username: this.form.username,
        password: this.form.password
      })
        .then(result => {
          this.disabled = false
          this.$utils.setCache('admin', {
            name: result.data.username,
            token: result.headers.authorization,
            time: result.headers.date
          })
          this.setAdminInfo(this.$utils.getCache('admin'))
          this.setDialogForm(false)
        }, error => {
          this.disabled = false
          switch (error.response.status) {
            case 400:
              this.message = '400: 用户名或密码错误'
              break
            case 404:
              this.message = '404: 网络异常'
              break
            default:
              this.message = error.response.status + ': ' + error.response.statusText
              break
          }
        })
    },
    closeDialog (formName) {
      this.resetForm(formName)
      this.setDialogForm(false)
    },
    ...mapMutations([
      'setDialogForm',
      'setAdminInfo',
      'setUserInfo',
      'setLoginStatus',
      'setSurveyId'
    ])
  }
}
</script>

<style lang="less">
  @import '../style/common';
</style>
