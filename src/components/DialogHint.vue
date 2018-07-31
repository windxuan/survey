<template>
  <el-dialog
    title="问卷说明"
    center
    :width="response"
    :visible="dialogHint"
    @close="setDialogHint(false)">
    <p>本问卷共有 {{ sum }} 道题，每道题的总分是 10 分。请将 10 分分配给你认为最准确地描述你的行为或感觉的选项上。</p>
    <p>你可以自由分配这 10 分，你认为哪一项越能反映你的行为或感受，就给这一项一个较高的分数；这10分既可以分别打给几项，也可以只打到一项上。</p>
    <p class="hint">
      <span class="red">注意：</span>每道题的总分必须是10分。
    </p>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'DialogHint',
  props: ['sum'],
  computed: {
    response: () => {
      let deviceWidth = document.documentElement.clientWidth
      if (deviceWidth >= 992) return '50%'
      else if (deviceWidth >= 768) return '80%'
      else if (deviceWidth >= 480) return '90%'
      return '92%'
    },
    ...mapState(['dialogHint'])
  },
  methods: mapMutations(['setDialogHint'])
}
</script>

<style scoped lang="less">
  p {
    text-indent: 25px;
    line-height: normal;
  }
  .hint {
    margin-top: 10px;
  }
  .red {
    color: red;
  }
  .green {
    color: green;
  }
</style>
