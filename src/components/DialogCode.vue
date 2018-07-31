<template>
  <el-dialog
    title="卷码生成数量"
    width="400px"
    :visible="$store.state.dialogCode"
    @close="closeDialog">
    <el-form inline>
      <el-form-item class="center">
        <el-input-number v-model="num" :min="1" :max="999"></el-input-number>
        <el-button
          type="success"
          :disabled="disabled"
          @click="sendUrlCode">一键生成</el-button>
      </el-form-item>
    </el-form>
    <p v-if="message" class="red">{{ message }}</p>
    <el-table
      :data="codes"
      max-height="375"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="问卷码">
        <template slot-scope="scope">
          <el-input v-model="scope.row">
          <el-button
            width="50"
            slot="append"
            v-clipboard:copy="scope.row"
            v-clipboard:success="onCopy">
            <el-tooltip effect="dark" placement="top" content="点击复制卷码">
              <i class="el-icon-document"></i>
            </el-tooltip>
          </el-button>
          </el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>

export default {
  name: 'DialogCode',
  props: ['surveyId'],
  data () {
    return {
      num: 1,
      codes: [],
      message: false,
      disabled: false
    }
  },
  methods: {
    onCopy () {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    // todo: 发送生成URL请求
    sendUrlCode () {
      this.disabled = true
      this.$http.get('url/generate', {
        params: {
          survey_id: this.surveyId,
          num: this.num
        }
      })
        .then(result => {
          this.disabled = false
          this.codes = result.data.map(function (val) {
            return val.substr(10)
          })
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              this.message = '401: 权限不足'
              break
            case 404:
              this.message = '404: 网络异常'
              break
            case 422:
              this.message = '422: 参数错误'
              break
            default:
              this.message = error.response.status + ': ' + error.response.statusText
              break
          }
        })
    },
    closeDialog () {
      this.$store.commit('setDialogCode', false)
      this.num = 1
      this.codes = []
      this.message = false
      this.disabled = false
    }
  }
}
</script>

<style scoped>
 .el-form-item {
   width: 100%;
   text-align: right;
 }
 .el-input-number {
   width: 70%;
 }
 .el-button {
   margin-left: 10px;
 }
 .red {
   color: red;
 }

</style>
