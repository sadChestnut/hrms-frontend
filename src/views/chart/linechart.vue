<template lang="pug">
div
  el-card
    div(slot="header")
      span 折线图
    el-form(:model="configChartForm", ref="configChartForm", :rules="rules", label-width="100px")
      el-form-item(label="图表标题")
        el-input.chart-input-style(v-model="configChartForm.title")
      el-form-item(label="图例数据")
        el-tag(v-for="tag in configChartForm.legendData", :key="tag", closable, :disable-transitions="false", @close="handleClose(tag)") {{tag}}
        el-input.input-new-tag(v-if="inputVisible",  v-model="inputValue", ref="saveTagInput", size="small", @keyup.enter.native="handleInputConfirm", @blur="handleInputConfirm")
        el-button.button-new-tag(v-else, size="small", @click="showInput") + New Legend
      el-form-item(label="x轴类目名称", prop="xaxislist")
        el-input.chart-input-style(v-model="configChartForm.xaxislist")
        span.remind-style 类目名称之间需用空格隔开
      el-form-item(label="数据详情")
        div(v-for="(item, key) in configChartForm.seriesKeyValue")
          label.label-key-style {{ item.name }}
          el-input.chart-input-style(v-model="item.data")
      el-form-item(label="y轴类目名称")
        el-input.chart-input-style(v-model="configChartForm.yAxisName")
  el-card(style="margin-top: 10px;")
    div(slot="header")
      span 生成图表展示
    div(style="width: 100%; height: 500px;", id="chart")
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'line-chart',
  data () {
    var validateXaxis = (rule, value, callback) => {
      let reg = /(^\s+)|(\s+$)|\s+/g
      if (!reg.test(value)) {
        callback(new Error('类目名称之间需用空格隔开'))
      } else {
        callback()
      }
    }
    return {
      seriesData: [
        {
          name: 'CMCC',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12
            }
          }
        },
        {
          name: 'CTCC',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12
            }
          }
        },
        {
          name: 'CUCC',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          }
        }
      ],
      configChartForm: {
        title: '折线图图例',
        legendData: ['CMCC', 'CTCC', 'CUCC'],
        xAxisData: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55'],
        xaxislist: '13:00 13:05 13:10 13:15 13:20 13:25 13:30 13:35 13:40 13:45 13:50 13:55',
        seriesKeyValue: [
          {
            name: 'CMCC',
            data: '220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122'
          },
          {
            name: 'CTCC',
            data: '120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150'
          },
          {
            name: 'CUCC',
            data: '220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122'
          }
        ],
        yAxisName: '数量详情'
      },
      chart: null,
      inputVisible: false,
      inputValue: '',
      rules: {
        xaxislist: [
          { validator: validateXaxis, trigger: 'blur' }
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
    clearChart () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    setSeriesKeyValue () {
      this.seriesData.map(item => {
        let index = this.configChartForm.seriesKeyValue.findIndex(val => val.name === item.name)
        if (index !== -1) {
          item.data = this.configChartForm.seriesKeyValue[index].data.split(',')
        }
      })
    },
    initChart () {
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: this.configChartForm.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.configChartForm.legendData,
          right: '10%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: this.configChartForm.xaxislist.split(' ')
        }],
        yAxis: [{
          type: 'value',
          name: this.configChartForm.yAxisName,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
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
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(' + r + ',' + g + ',' + b + ', 0.3)'
            }, {
              offset: 0.8,
              color: 'rgba(137, 189, 27, 0)'
            }], false),
            shadowColor: 'rgba(' + r + ',' + g + ',' + b + ', 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: 'rgba(' + r + ',' + g + ',' + b + ')',
            borderColor: 'rgba(' + r + ',' + g + ',' + b + ', 0.37)',
            borderWidth: 12
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
