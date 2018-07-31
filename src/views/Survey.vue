<template>
  <div class="container">
    <el-row>
      <!-- item -->
      <el-col>
        <el-carousel
          ref="carousel"
          type="card"
          height="648px"
          arrow="never"
          trigger="click"
          :autoplay="false"
          :interval="4000"
          @change="changeItem">
          <Indicator
            :data="surveyData"
            :sindex="activeIndex"
            :scores="rateNums"
            @setIndex="setActiveItem"/>
          <el-button-group class="aside">
            <el-button
              type="primary"
              size="mini"
              :disabled="this.activeIndex === 0"
              @click="prev()">上一题
            </el-button>
            <el-button
              type="primary"
              size="mini"
              :disabled="this.activeIndex === this.surveyData.length - 1"
              @click="next()">下一题
            </el-button>
            <el-button
              type="info"
              size="mini"
              autofocus
              @click="setDialogHint(true)">说明
            </el-button>
            <el-button
              type="success"
              size="mini"
              @click="submit()">
              <TimeEnd :time="30"/> 提交问卷
            </el-button>
          </el-button-group>
          <div
            class="mask-survey"
            @click="next()"></div>
          <el-carousel-item
            v-for="(val, index) in surveyData"
            :key="index">
            <el-rate
              v-model="rateNums[index]"
              text-color="#ff9900"
              score-template="{value}"
              show-score
              disabled
              :low-threshold="9"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :max="10">
            </el-rate>
            <el-tag
              v-show="rateNums[index] > 10"
              style="margin-left: 20px"
              type="danger"
              size="small">分值溢出: {{ rateNums[index] - 10 }}
            </el-tag>
            <h3>{{ $utils.digitDX(++index) + '、' + val.question }}</h3>
            <div class="content">
              <div
                v-for="(option, cindex) in val.options"
                :key="cindex">
                <span class="demonstration">{{++cindex + '、' + option.text}}</span>
                <el-slider
                  v-model="option.firstCode"
                  show-stops
                  show-input
                  input-size="mini"
                  style="margin-left: 30px"
                  @change="changeRate"
                  :step="1"
                  :max="10">
                </el-slider>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <!-- 问卷提示 -->
    <DialogHint :sum="surveyData.length"/>
  </div>
</template>

<script>
import DialogHint from '@/components/DialogHint'
import TimeEnd from '@/components/TimeEnd'
import Indicator from '@/components/Indicator'

import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Survey',
  components: {
    DialogHint,
    TimeEnd,
    Indicator
  },
  data () {
    return {
      activeIndex: 0,
      // 问卷数据
      surveyData: [],
      rate: 10,
      rateNums: []
    }
  },
  computed: {
    ...mapState(['userInfo', 'surveyId'])
  },
  created () {
    // 检测用户信息
    if (!this.userInfo) {
      this.setUserInfo(this.$utils.getCache('user'))
    }
    // 检测问卷缓存
    if (localStorage.hasOwnProperty('survey-' + this.surveyId)) {
      this.surveyData = this.$utils.getCache('survey-' + this.surveyId)
    } else {
      this.sendSurvey()
    }
    this.$nextTick(() => {
      this.rateNums = []
      this.surveyData.forEach((element, index) => {
        let rates = 0
        element.options.forEach((ele, seria) => {
          rates += ele.firstCode
        })
        this.rateNums.push(rates)
      })
    })
  },
  methods: {
    // 获取问卷(需先生成URL)
    sendSurvey () {
      // 发送请求问卷信息(传入生成的URL)
      this.$http.get('survey/url' + this.userInfo.code)
        .then(result => {
          this.surveyData = result
        })
        .catch(error => {
          switch (error.response.status) {
            case 400:
              this.$message.error('卷码不可重复使用')
              break
            default:
              this.$message.error('未知错误')
              this.message = error.response.status + ': ' + error.response.statusText
              break
          }
        })
    },
    submit () {
      let questions = [] // 新建分数信息数组
      this.surveyData.forEach((element, index) => {
        let obj = {}
        questions.push(obj)
        this.$set(obj, 'id', index + 1)
        this.$set(obj, 'options', [])
        element.options.forEach((ele, serial) => {
          let objTwo = {}
          this.$set(objTwo, 'id', serial + 1)
          this.$set(objTwo, 'code', ele.code)
          this.$set(objTwo, 'score', ele.firstCode)
          questions[index].options.push(objTwo)
        })
      })

      if (this.$utils.sum(this.rateNums) !== (this.rateNums.length * 10)) {
        this.$alert('答题分数不合规则，请重新修改提交', {
          center: true
        })
      } else {
        this.$http.post('survey', {
          'staff': {
            'name': this.userInfo.username,
            'sex': this.userInfo.sex,
            'staff_no': this.userInfo.staff_no
          },
          'questions': questions,
          'noncestr': 'url' + this.userInfo.code
        })
          .then(success => {
            this.disabled = false
            if (localStorage.hasOwnProperty('survey-' + this.surveyId)) {
              localStorage.removeItem(this.userInfo.code)
            }
            // 清空已使用卷码
            this.setSurveyCode('')
            this.$alert('<div class="gift"></div>', '感谢您的参与，祝您工作愉快', {
              confirmButtonText: '返回主页',
              dangerouslyUseHTMLString: true,
              showClose: false,
              closeOnClickModal: false,
              center: true,
              callback: () => {
                this.$router.push({ name: 'home' })
              }
            })
          })
          .catch(error => {
            this.disabled = false
            switch (error.response.status) {
              case 422:
                this.$message.error('问卷题目评分有误')
                break
              case 400:
                this.$message.error('无效卷码')
                break
              default:
                this.message = error.response.status + ': ' + error.response.statusText
                break
            }
          })
      }
    },
    changeRate () {
      this.rateNums = []
      this.surveyData.forEach(element => {
        let rates = 0
        element.options.forEach(ele => {
          rates += ele.firstCode
        })
        this.rateNums.push(rates)
      })
    },
    changeItem (index) {
      this.activeIndex = index
    },
    prev () {
      this.$refs.carousel.prev()
    },
    next () {
      if (this.activeIndex !== this.surveyData.length - 1) {
        this.$refs.carousel.next()
      }
    },
    setActiveItem (index) {
      this.$refs.carousel.setActiveItem(index)
    },
    ...mapMutations(['setUserInfo', 'setSurveyCode', 'setDialogHint'])
  }
}
</script>

<style lang="less">
  .el-carousel {
    position: relative;
    padding: 35px 0 5px;
    overflow: hidden;
  }
  .el-carousel__item {
    position: relative;
    padding: 15px;
    font-size: 13px;
    opacity: .5;
    height: 100%;
    filter: blur(3px) contrast(.8) brightness(.8);
    &.is-active {
      background-color: #fff;
      box-shadow: 1px 3px 8px #ccc;
      opacity: 1;
      filter: none;
      padding-right: 1px;
      .content {
        padding-right: 10px;
        padding-bottom: 65px;
        height: 100%;
        overflow: scroll !important;
      }
    }
    h3 {
      margin: 10px 15px 10px 0;
      padding: 10px 10px 10px 0;
      font-size: 14px;
      border-bottom: 1px dashed #666;
    }
  }
  // 隐藏自带指示器
  .el-carousel__indicators.el-carousel__indicators--outside {
    display: none
  }
  .el-rate {
    display: inline-block;
  }
  .el-carousel__item.is-active {
    width: 60%;
    transform: none !important;
  }
  .aside {
    position: absolute;
    top: -20px;
    right: 0;
  }
  .mask-survey {
    position: absolute;
    top: 20px;
    left: 60%;
    width: 40%;
    height: 100%;
    z-index: 2;
  }
</style>
