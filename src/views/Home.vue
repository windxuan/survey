<template>
  <div class="home container">
    <el-row :gutter="10">
      <el-col :xs="24">
        <Paging
          v-show="surveyList.length > 8"
          :data="surveyList"
          :size="8"
          @pipe="getPagesData"/>
      </el-col>
      <el-col
        v-for="val in pagesData" :key="val.id"
        :xs="12" :sm="8" :md="6">
        <transition name="el-zoom-in-center" appear>
          <el-card shadow="hover">
            <img class="img-responsive" src="@/assets/team.jpg">
            <div class="intro">
              <span class="ellipsis">{{ val.name }}</span>
              <div>
                <time class="time">{{ val.created_at | date }}</time>
              </div>
            </div>
            <div class="mask">
              <p v-if="val.show">评测: {{ val.show }}</p>
              <p v-if="val.desc">类型: {{ val.desc }}</p>
              <div class="footer">
                <el-tooltip
                  effect="dark"
                  placement="bottom"
                  content="开始答卷">
                  <el-button
                    v-if="!loginType"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="toSurvey(val.id)">
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  placement="bottom-end"
                  content="卷码生成">
                  <el-button
                    v-if="loginType"
                    type="success"
                    size="mini"
                    circle
                    @click="getUrlCode(val.id)">
                    <img class="icon" src="@/assets/icon/code.svg" alt="卷码">
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  content="聚合分数">
                  <el-button
                    v-if="loginType"
                    type="primary"
                    size="mini"
                    circle
                    @click="toSummary(val.id)">
                    <img class="icon" src="@/assets/icon/result.svg" alt="汇总">
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </transition>
      </el-col>
    </el-row>
    <DialogCode :surveyId="surveyId"/>
  </div>
</template>

<script>
import Paging from '@/components/Paging'
import DialogCode from '@/components/DialogCode'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',
  components: {
    Paging,
    DialogCode
  },
  data () {
    return {
      surveyList: [],
      surveyId: 1,
      pagesData: []
    }
  },
  created () {
    // 获取问卷列表
    this.$http.get('survey')
      .then(result => {
        this.surveyList = result.data.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    ...mapState(['userInfo']),
    ...mapGetters(['loginStatus', 'loginType'])
  },
  filters: {
    date (val) {
      return val.slice(0, -3)
    }
  },
  methods: {
    getPagesData (val) {
      this.pagesData = val
    },
    // 开始答卷
    toSurvey (id) {
      if (this.loginStatus) {
        if (!this.userInfo.code) {
          // 卷码已使用
          this.$message({
            message: '卷码已使用',
            type: 'warning'
          })
          this.changeCode()
        } else if (id !== (this.userInfo.code.split('-')[0] - 0)) {
          // 卷码不适用
          this.$message('当前卷码仅适用于问卷' + this.userInfo.code.split('-')[0])
        } else {
          this.setSurveyId(id)
          this.$router.push({ name: 'survey' })
        }
      }
      if (!this.loginStatus) {
        this.setFormType(false)
        this.setDialogForm(true)
      }
    },
    // 聚合分数
    toSummary (id) {
      this.setSurveyId(id)
      this.$router.push({ name: 'summary', query: {id: id} })
    },
    // 获取问卷码
    getUrlCode (id) {
      this.surveyId = id
      this.setDialogCode(true)
    },
    changeCode () {
      this.$prompt('请输入卷码', {
        confirmButtonText: '确定更换',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]+[-]+[a-zA-Z0-9]{9,}$/,
        inputErrorMessage: '卷码格式不正确'
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
    },
    ...mapMutations([
      'setDialogForm',
      'setDialogCode',
      'setSurveyId',
      'setFormType'
    ])
  }
}
</script>

<style lang="less">
  .el-col {
    margin-top: 10px;
  }
  .el-card {
    position: relative;
    &:hover .mask {
      display: block;
    }
  }
  .intro {
    > div {
      margin-top: 13px;
      line-height: 12px;
    }
    time {
      font-size: 13px;
      color: #999;
    }
  }
  .mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
    width: 100%;
    height: 100%;
    color: #fff;
    background: rgba( 0, 0, 0, .5);
    .footer {
      margin-top: 20px;
      width: 100%;
      text-align: center;
    }
    p {
      font-size: 12px;
      line-height: 20px;
    }
  }
  .icon {
    width: 25px;
  }
  .el-select .el-input {
    width: 120px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
