<template>
  <div class="indicator">
    <span
      v-for="(item, index) in data"
      class="item"
      :class="{
        'active': index === sindex,
        'warn': scores[index] > 10,
        'end': scores[index] === 10,
        'start-1': scores[index] === 1,
        'start-2': scores[index] === 2,
        'start-3': scores[index] === 3,
        'start-4': scores[index] === 4,
        'start-5': scores[index] === 5,
        'start-6': scores[index] === 6,
        'start-7': scores[index] === 7,
        'start-8': scores[index] === 8,
        'start-9': scores[index] === 9
      }"
      :key="index"
      @click="$emit('setIndex', index)">第{{ $utils.digitDX(index + 1) }}题
    </span>
  </div>
</template>

<script>
export default {
  name: 'Indicator',
  props: ['data', 'sindex', 'scores']
}
</script>

<style scoped lang="less">
  .indicator {
    position: absolute;
    top: -42px;
    span {
      position: relative;
      display: inline-block;
      padding: 10px 10px 4px;
      font-size: 14px;
      color: #333;
      background: #fff;
      box-shadow: 1px 3px 8px #ccc;
      box-sizing: content-box;
      cursor: pointer;
      &:not(:first-child) {
        margin-left: 5px;
      }
      &.active {
        border-bottom: 3px solid #FFD04B;
      }
      &.end {
        background: #9FF048;
      }
      &.warn {
        background: #FF534D;
      }
    }
  }
  .start(@score-size) when (@score-size > 0) {
    .start(@score-size - 1);
    .indicator span.start-@{score-size}::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 10% * @score-size;
      height: 100%;
      background: #9FF048;
      opacity: .5;
      z-index: 0;
    }
  }
  .start(9);
</style>
