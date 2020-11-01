<template lang="pug">
div
  el-card
    div(slot="header")
      span 柱状图
    el-form(:model="configChartForm", label-width="100px")
      el-form-item(label="图表标题")
        el-input.chart-input-style(v-model="configChartForm.title")
      el-form-item(label="图例数据")
        el-tag(v-for="tag in configChartForm.legendData", :key="tag", closable, :disable-transitions="false", @close="handleClose(tag)") {{tag}}
        el-input.input-new-tag(v-if="inputVisible",  v-model="inputValue", ref="saveTagInput", size="small", @keyup.enter.native="handleInputConfirm", @blur="handleInputConfirm")
        el-button.button-new-tag(v-else, size="small", @click="showInput") + New Legend
      el-form-item(label="x轴类目名称", prop="xData")
        el-input.chart-input-style(v-model="configChartForm.xData")
        span.remind-style 类目名称之间需用空格隔开
      el-form-item(label="数据详情")
        div(v-for="(item, key) in configChartForm.seriesKeyValue")
          label.label-key-style {{ item.name }}
          el-input.chart-input-style(v-model="item.data")
  el-card(style="margin-top: 10px;")
    div(slot="header")
      span 生成图表展示
    div(style="width: 100%; height: 500px;", id="chart")
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'bar-graph-chart',
  data () {
    var validateXdata = (rule, value, callback) => {
      let reg = /(^\s+)|(\s+$)|\s+/g
      if (!reg.test(value)) {
        callback(new Error('类目名称之间需用空格隔开'))
      } else {
        callback()
      }
    }
    return {
      chart: null,
      inputVisible: false,
      inputValue: '',
      seriesData: [
        {
          name: 'female',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop',
                formatter (p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          }
        },
        {
          name: 'male',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter (p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          }
        }
      ],
      configChartForm: {
        title: '柱状图图例',
        legendData: ['female', 'male'],
        xData: '1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月',
        seriesKeyValue: [
          {
            name: 'female',
            data: '2200, 1820, 1910, 1340, 1500, 1200, 1100, 1250, 1450, 1220, 1650, 1220'
          },
          {
            name: 'male',
            data: '1200, 1100, 1250, 1450, 1220, 1650, 1220, 2200, 1820, 1910, 1340, 1500'
          }
        ]
      },
      rules: {
        xData: [
          { validator: validateXdata, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.setSeriesKeyValue()
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    this.clearChart()
  },
  methods: {
    setSeriesKeyValue () {
      this.seriesData.map(item => {
        let index = this.configChartForm.seriesKeyValue.findIndex(val => val.name === item.name)
        if (index !== -1) {
          item.data = this.configChartForm.seriesKeyValue[index].data.split(',')
        }
      })
    },
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
        backgroundColor: '#344b58',
        title: {
          text: this.configChartForm.title,
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: this.configChartForm.legendData
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: this.configChartForm.xData.split(' ')
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: this.seriesData
      })
    },
    handleClose (tag) {
      this.configChartForm.legendData.splice(this.configChartForm.legendData.indexOf(tag), 1)
      let findinedx = this.configChartForm.seriesKeyValue.findIndex(item => item.name === tag)
      this.configChartForm.seriesKeyValue.splice(findinedx, 1)
      delete this.configChartForm.seriesKeyValue[tag]
      let index = this.seriesData.findIndex(item => item.name === tag)
      this.seriesData.splice(index, 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      let r = Math.floor(Math.random() * 256)
      let g = Math.floor(Math.random() * 256)
      let b = Math.floor(Math.random() * 256)
      if (inputValue && inputValue !== '') {
        this.configChartForm.seriesKeyValue.push({ name: inputValue, data: '' })
      }
      let configOptions = {
        name: inputValue,
        type: 'bar',
        stack: 'total',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: 'rgba(' + r + ',' + g + ',' + b + ', 1)',
            label: {
              show: true,
              textStyle: {
                color: '#fff'
              },
              position: 'insideTop',
              formatter (p) {
                return p.value > 0 ? p.value : ''
              }
            }
          }
        }
      }
      if (inputValue && inputValue !== '') {
        this.configChartForm.legendData.push(inputValue)
      }
      this.seriesData.push({ ...configOptions })
      this.inputVisible = false
      this.inputValue = ''
    }
  },
  watch: {
    configChartForm: {
      handler: function (newVal, oldVal) {
        this.clearChart()
        this.setSeriesKeyValue()
        this.initChart()
      },
      deep: true
    },
    seriesData: {
      handler: function (newVal, oldVal) {
        this.clearChart()
        this.setSeriesKeyValue()
        this.initChart()
      },
      deep: true
    },
    'configChartForm.seriesKeyValue': {
      handler: function (newVal, oldVal) {
        this.configChartForm.seriesKeyValue = newVal
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
.remind-style {
  color: #ff0000;
  margin-left: 10px;
}
.label-key-style {
  display: inline-block;
  width: 80px;
  margin-bottom: 10px;
}
</style>
