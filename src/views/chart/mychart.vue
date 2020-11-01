<template lang="pug">
div
  el-card(style="margin-bottom: 10px;")
    div(slot="header")
      span 自定义图表
    el-form(label-width="100px")
      el-form-item(label="图表类型")
        el-select(v-model="type")
          el-option(v-for="(chart, index) in chartsType", :label="chart", :value="chart", :key="index")
  template
    custom-chart(v-if="type === '表格'")
    line-chart(v-else-if="type === '折线图'")
    bar-graph-chart(v-else-if="type === '柱状图'")
    bar-chart(v-else)
</template>
<script>
import lineChart from './linechart'
import barGraphChart from './bargraphchart'
import barChart from './barchart'
import customChart from './customchart'
export default {
  name: 'my-chart',
  components: { customChart, lineChart, barGraphChart, barChart },
  data () {
    return {
      type: '表格',
      chartsType: ['表格', '折线图', '柱状图', '饼图']
    }
  }
}
</script>
<style lang="less">
</style>
