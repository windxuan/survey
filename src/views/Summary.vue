<template>
  <div class="container-fluid">
    <div class="container">
      <el-row>
        <el-col :xs="24" :sm="12">
          <!-- 搜索 -->
          <el-form
            :data="search"
            inline
            @submit.native.prevent>
            <el-input
              v-model="search.value"
              placeholder="请输入查询内容"
              @keyup.enter.native="findData"
              @blur="findData"
              clearable>
              <el-select
                v-model="search.select"
                slot="prepend">
                <el-option
                  v-for="item in search.option"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="findData"></el-button>
            </el-input>
          </el-form>
        </el-col>
        <el-col :xs="24" :sm="12" class="center">
          <!-- 标签颜色说明 -->
          <el-tooltip class="item" effect="dark" content="分值为：0" placement="bottom">
            <span class="lump">缺失</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分值在：30—69之间" placement="bottom">
            <span class="lump">次要</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分值不低于72分" placement="bottom">
            <span class="lump">良好</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分值不低于93分" placement="bottom">
            <span class="lump">优秀</span>
          </el-tooltip>
        </el-col>
          <el-col :xs="24" class="center">
          <!-- 分页 -->
          <Paging
            :data="temporaryData"
            :size="10"
            @pipe="getPagesData"/>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col>
        <TableSum
          :data="pagesData"
          @sort="setSort"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Paging from '@/components/Paging'
import TableSum from '@/components/TableSum'
import { mapState } from 'vuex'
export default {
  name: 'Summary',
  components: {
    Paging,
    TableSum
  },
  data () {
    return {
      // 分页处理后渲染数据
      pagesData: [],
      // 原始数据
      summaryData: [],
      // 查询条件
      search: {
        option: [
          {
            value: '1',
            label: '姓名'
          },
          {
            value: '2',
            label: '性别'
          },
          {
            value: '3',
            label: '标签'
          }
        ],
        select: '1',
        value: ''
      },
      // 存放满足查询条件的数据
      queryLists: [],
      // 临时用来储存summaryData里面的数据
      temporaryData: []
    }
  },
  computed: mapState(['surveyId']),
  created () {
    this.getSummary()
  },
  methods: {
    getPagesData (val) {
      this.pagesData = val
    },
    // 获取聚合分数
    getSummary () {
      this.$http.get('survey/summary?where[][survey_id]=' + this.$route.query.id)
        .then(result => {
          this.summaryData = result
          console.log(this.summaryData)
          this.setSort(true)
          this.temporaryData = this.summaryData // 用空数组记录数据
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.status)
          }
        })
    },
    // 设置排序
    setSort (val) {
      if (val) {
        this.summaryData.sort((a, b) => {
          return b[0] - a[0]
        })
      } else {
        this.summaryData.sort((a, b) => {
          return a[0] - b[0]
        })
      }
    },
    findData () {  //搜索功能
      let field = this.search.select === '1' ? 'name' : 'sex'
      // 每次都将数组清空
      this.queryLists = []
      this.summaryData.forEach((element, index) => {
        if (element[1][0].staff[field].indexOf(this.search.value) >= 0) {
          // 将满足查询条件的数据存放到这个数组
          this.queryLists.push(this.summaryData[index])
          // 将满足条件的数组赋值给渲染的数组
          this.temporaryData = this.queryLists
        }
      })
      if (this.search.select === '3') {
        this.queryLists = []
        this.summaryData.forEach((element, index) => {
          element[2].forEach((ele, seria) => {
            console.log(ele)
            if (ele.indexOf(this.search.value) >= 0) {
              this.queryLists.push(this.summaryData[index])
              this.temporaryData = this.queryLists
            }
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  .lump {
    font-size: 14px;
    line-height: 40px;
    &::before {
      content: '';
      display: inline-block;
      margin-right: 5px;
      width: 15px;
       height: 15px;
    }
    &:not(:first-child) {
      margin-left: 20px;
    }
    &:nth-child(1)::before {
      background-color: #909399;
    }
    &:nth-child(2)::before {
      background-color: #F56C6C;
    }
    &:nth-child(3)::before {
      background-color: #67C23A;
    }
    &:nth-child(4)::before {
      background-color: #409EFF;
    }
  }

</style>
