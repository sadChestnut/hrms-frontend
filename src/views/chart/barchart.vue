<template lang="pug">
div
  el-card
    div(slot="header")
      span 饼图
    el-form(:model="configChartForm", label-width="100px")
      el-form-item(label="图表标题")
        el-input.chart-input-style(v-model="configChartForm.title")
      el-form-item(label="图例数据")
        el-tag(v-for="tag in configChartForm.legendData", :key="tag", closable, :disable-transitions="false", @close="handleClose(tag)") {{tag}}
        el-input.input-new-tag(v-if="inputVisible",  v-model="inputValue", ref="saveTagInput", size="small", @keyup.enter.native="handleInputConfirm", @blur="handleInputConfirm")
        el-button.button-new-tag(v-else, size="small", @click="showInput") + New Legend
      el-form-item(label="系列名称")
        el-input.chart-input-style(v-model="configChartForm.name")
      el-form-item(label="数据详情")
        div(v-for="(item, key) in configChartForm.seriesData")
          label.label-key-style {{ item.name }}
          el-input.chart-single-input-style(v-model="item.value")
  el-card(style="margin-top: 10px;")
    div(slot="header")
      span 生成图表展示
    div(style="display: flex; justify-content: center;")
      div(style="width: 1000px; height: 500px;", id="chart")
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'bar-chart',
  data () {
    return {
      chart: null,
      inputVisible: false,
      inputValue: '',
      configChartForm: {
        title: '饼图图例',
        legendData: ['CUCC', 'CMCC', 'CWCC', 'CXCC', 'CCCC'],
        seriesData: [
          {
            name: 'CUCC',
            value: 200
          },
          {
            name: 'CMCC',
            value: 400
          },
          {
            name: 'CWCC',
            value: 500
          },
          {
            name: 'CXCC',
            value: 100
          },
          {
            name: 'CCCC',
            value: 250
          }
        ],
        name: '例子'
      }
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    this.clearChart()
  },
  methods: {
    clearChart () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    initChart () {
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          text: this.configChartForm.title,
          x: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 40,
          top: 30,
          bottom: 20,
          data: this.configChartForm.legendData,
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        series: [
          {
            name: this.configChartForm.name,
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: this.configChartForm.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    handleClose (tag) {
      this.configChartForm.legendData.splice(this.configChartForm.legendData.indexOf(tag), 1)
      let index = this.configChartForm.seriesData.findIndex(item => item.name === tag)
      this.configChartForm.seriesData.splice(index, 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue && inputValue !== '') {
        this.configChartForm.seriesData.push({ name: inputValue, value: 0 })
        this.configChartForm.legendData.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  },
  watch: {
    configChartForm: {
      handler: function (newVal, oldVal) {
        this.clearChart()
        this.initChart()
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.chart-input-style {
  width: 500px;
}
.chart-single-input-style {
  width: 300px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.label-key-style {
  display: inline-block;
  width: 80px;
  margin-bottom: 10px;
}
</style>
