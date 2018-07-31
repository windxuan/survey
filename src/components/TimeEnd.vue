<template>
<time>{{minute}}:{{second}}</time>
</template>

<script>
export default {
  name: 'TimeEnd',
  props: ['time'],
  data () {
    return {
      minutes: 15,
      seconds: 0,
      show: true
    }
  },
  computed: {
    second () {
      return this.zero(this.seconds)
    },
    minute () {
      return this.zero(this.minutes)
    }
  },
  watch: {
    second: {
      handler (newVal) {
        this.zero(newVal)
      }
    },
    minute: {
      handler (newVal) {
        this.zero(newVal)
      }
    }
  },
  created () {
    if (this.time) {
      this.minutes = this.time
    }
    let timer = setTimeout(() => {
      this.$alert('答题时间到，请重新答题', {
        center: true,
        callback: action => {
          location.reload()
        }
      })
    }, this.minutes * 60 * 1000)
    if (this.$store.state.activePage !== 'survey') {
      clearTimeout(timer)
    }
  },
  mounted () {
    this.add()
    this.change()
  },
  methods: {
    zero (n) {
      return n < 10 ? '0' + n : '' + n
    },
    add () {
      let time = window.setInterval(() => {
        if (this.seconds === 0 && this.minutes !== 0) {
          this.seconds = 59
          this.minutes -= 1
        } else if (this.minutes === 0 && this.seconds === 0) {
          this.seconds = 0
          window.clearInterval(time)
        } else {
          this.seconds -= 1
        }
      }, 1000)
    },
    change () {
      this.show = !this.show
    }
  }
}
</script>

<style scoped lang="less">
  .fade-leave-active {
    transition: all 1800s linear;
  }
  .fade-leave-to {
    transform: translateX(215px);
    opacity: 1;
  }
  .time-snail {
    width: 350px;
  }
  .snail {
    margin: 0;
    padding: 0;
  }
  .anim{
    width: 250px;
    height: 2px;
    background-color: #9FF048;
  }
  .time{
    font-family: Arial;
    font-size: 36px;
    color: #409EFF;
    font-weight: 700;
  }
</style>
