<template lang="pug">
div.table-style
  el-card
    div(slot="header")
      span 自定义表格
    el-form(label-width="100px")
      el-form-item(label="表格标题")
        el-input.chart-input-style(v-model="configChartForm.title")
      el-form-item(label="表格项")
        div(v-for="(item, index) in configChartForm.tableColumnData")
          el-input.chart-single-input-style(:value="item.label", style="margin: 0 10px 5px 0", v-on:input="updateColumn($event, index)")
          el-button(type="primary", icon="el-icon-plus", circle, @click="addNewColumn(index)")
          el-button(type="primary", icon="el-icon-minus", circle, @click="minusColumn(index)", :disabled="item.prop === 'index'")
      el-form-item(label="表格操作")
        el-button(type="primary", icon="el-icon-edit", @click="editTableData") 编辑表格数据
        el-button(type="primary", icon="el-icon-plus", @click="addNewRow") 增加表行
        el-button(type="primary", icon="el-icon-delete", @click="delRow") 删除表行
  el-card(style="margin-top: 10px;")
    div.clearfix(slot="header")
      el-button(type="primary", style="float: right;", @click="tableToExcel") 表格下载
    div(style="text-align:center;")
      span.table-title-style {{ configChartForm.title }}
      el-table(:data="tableData", border, highlight-current-row, @current-change="handleCurrentChange")
        el-table-column(v-for="item in configChartForm.tableColumnData", :label="item.label", :prop="item.prop", :key="item.prop")
  edit-data(v-if="isshow",:isshow="isshow", :currentRow="currentRow", :column="configChartForm.tableColumnData", @click="updateIsShow", @updateData="updateData")
</template>
<script>
import editData from './editdata'
export default {
  name: 'custom-chart',
  components: { editData },
  data () {
    return {
      configChartForm: {
        title: '表格名称',
        tableColumnData: [
          {
            label: '序号',
            prop: 'index'
          },
          {
            label: '出生日期',
            prop: 'birthday'
          },
          {
            label: '姓名',
            prop: 'name'
          },
          {
            label: '电子邮件',
            prop: 'email'
          },
          {
            label: '联系方式',
            prop: 'phone'
          }
        ]
      },
      variableList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      tableData: [
        {
          index: 0,
          birthday: '2016-05-04',
          name: '李小华',
          email: '1145102323@qq.com',
          phone: '1234567890'
        },
        {
          index: 1,
          birthday: '2016-05-04',
          name: '李小明',
          email: '1145102323@qq.com',
          phone: '1234567890'
        },
        {
          index: 2,
          birthday: '2016-05-04',
          name: '李超',
          email: '1145102323@qq.com',
          phone: '1234567890'
        }
      ],
      currentRow: null,
      isshow: false
    }
  },
  created () {
  },
  methods: {
    makeWord () {
      var nameLen = Math.ceil(Math.random() * 4 + 1)
      var name = []
      for (var i = 0; i < nameLen; i++) {
        name.push(this.variableList[Math.round(Math.random() * this.variableList.length - 1)])
      }
      return name.join('')
    },
    addNewColumn (index) {
      this.configChartForm.tableColumnData.splice(index + 1, 0, {label: '', prop: this.makeWord()})
    },
    minusColumn (index) {
      this.configChartForm.tableColumnData.splice(index, 1)
    },
    updateColumn (value, index) {
      this.configChartForm.tableColumnData[index].label = value
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    editTableData () {
      if (this.currentRow === null) {
        this.$message.warning('请先选择一行数据')
        return
      }
      this.isshow = true
    },
    updateIsShow (val) {
      this.isshow = val
    },
    updateData (obj) {
      this.tableData.splice(obj.index, 1, obj)
    },
    addNewRow () {
      let index = this.tableData.length
      let obj = {}
      this.configChartForm.tableColumnData.map(item => {
        if (item.prop === 'index') {
          obj[item.prop] = index
        } else {
          obj[item.prop] = ''
        }
      })
      this.tableData.splice(index, 0, {...obj})
    },
    delRow () {
      if (this.currentRow === null) {
        this.$message.warning('请先选择需要删除的行')
        return
      }
      this.tableData.splice(this.currentRow.index, 1)
      let findindex = this.currentRow.index
      this.tableData.map((item, index) => {
        if (index > findindex - 1) {
          item.index = index
        }
      })
    },
    tableToExcel () {
      let str = ''
      let length = this.configChartForm.tableColumnData.length
      this.configChartForm.tableColumnData.map((item, index) => {
        if (index !== length - 1) {
          str += item.label + ','
        } else {
          str += item.label + '\n'
        }
      })
      this.tableData.map(item => {
        for (let i in item) {
          str += `${item[i] + '\t'},`
        }
        str += '\n'
      })
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
      var link = document.createElement('a')
      link.href = uri
      link.download = this.configChartForm.title + '.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  watch: {
    configChartForm: {
      handler: function (newVal, oldVal) {
      },
      deep: true
    },
    isshow: {
      handler: function (newVal, oldVal) {
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.table-style {
  .chart-input-style {
    width: 500px;
  }
  .chart-single-input-style {
    width: 300px;
  }
  .el-button {
    padding: 8px;
    font-size: 13px;
  }
  .clearfix {
    &::after, &::before {
      display: table;
      content: "";
    }
    &::after {
      clear: both
    }
  }
  .table-title-style {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 18px;
  }
}

</style>
