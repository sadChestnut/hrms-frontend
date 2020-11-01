<template lang="pug">
  el-dialog(title="分配项目时间", :visible="dialogDateVisible", :before-close="closeDialog")
    div
      div.select-date-style
        label 起始时间
        el-date-picker(type="month", v-model="starttime", placeholder="选择起始时间", value-format="yyyy-MM-dd")
      div.select-date-style
        label 结束时间
        el-date-picker(type="month", v-model="endtime", placeholder="选择结束时间", value-format="yyyy-MM-dd")
      div.date-range-style
        label 日期范围
        span(v-if="starttime !== '' && endtime !== ''")  {{showstarttime}} 至 {{showendtime}}
    div(slot="footer")
      el-button(@click="closeDialog") 取消
      el-button(type="primary", @click="submitProTime", :disabled="isDisabled") 确定
</template>
<script>
import moment from 'moment'
import projectService from '@/service/projectService'
import {formateTime} from '@/utils/common'
export default {
  name: 'assignDate',
  data () {
    return {
      dialogDateVisible: this.isShow,
      starttime: '',
      endtime: '',
      leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      commonyear: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      showstarttme: '',
      showendtime: '',
      workdetail: []
    }
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    empnum: {
      type: String,
      required: true
    }
  },
  watch: {
    isShow: {
      handler: function (newVal, oldVal) {
        this.dialogDateVisible = newVal
      },
      deep: true
    },
    starttime: {
      handler: function (newVal, oldVal) {
        this.showstarttime = this.formateTime(newVal)
      },
      deep: true
    },
    endtime: {
      handler: function (newVal, oldVal) {
        this.showendtime = this.judgeDate(newVal).format('YYYY-MM-DD')
      },
      deep: true
    },
    empnum: {
      handler: function (newVal, oldVal) {
        this.empnum = newVal
      },
      deep: true
    }
  },
  computed: {
    isDisabled: function () {
      return this.starttime === '' || this.endtime === ''
    }
  },
  methods: {
    formateTime,
    closeDialog () {
      this.dialogDateVisible = false
      this.$emit('updateIsShow', this.dialogDateVisible)
      this.starttime = ''
      this.endtime = ''
    },
    submitProTime () {
      const obj = {
        starttime: moment(this.starttime).valueOf(),
        endtime: this.judgeDate().valueOf()
      }
      this.$emit('click', JSON.parse(JSON.stringify(obj)))
      this.closeDialog()
    },
    judgeDate () {
      let yeararr = []
      let daytime = 0
      if (this.judgeLeapYear()) {
        yeararr = this.leapyear
      } else {
        yeararr = this.commonyear
      }
      if (this.starttime === this.endtime) {
        daytime = yeararr[moment(this.starttime).get('month')] - 1
        return moment([moment(this.starttime).get('year'), moment(this.starttime).get('month'), moment(this.starttime).get('date')]).add(daytime, 'days')
      } else {
        daytime = yeararr[new Date(this.endtime).getMonth()] - 1
        return moment([moment(this.endtime).get('year'), moment(this.endtime).get('month'), moment(this.endtime).get('date')]).add(daytime, 'days')
      }
    },
    judgeLeapYear () {
      const year = new Date().getFullYear()
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 !== 0)) {
        return true
      } else {
        return false
      }
    },
    getworkDetail () {
      let maxmonth = 0
      projectService.getEmpWorkDetail({empnum: this.empnum}).then(res => {
        res.obj.list.map(item => {
          let month = moment(item.endtime).get('month')
          if (maxmonth < month) {
            maxmonth = month
          }
        })
      }).then(() => {
        if (maxmonth !== 0) {
          maxmonth = maxmonth + 2
        }
        this.starttime = new Date(new Date().getFullYear() + '-' + maxmonth + '-1')
      })
    }
  },
  created () {
    // this.getworkDetail()
  }
}
</script>
<style lang="less">
.select-date-style {
  display: inline-block;
  margin-right: 20px;
  label {
    margin-right: 10px;
  }
}
.date-range-style {
  margin-top: 20px;
  span {
    margin-left: 10px;
    color: #409EFF;
  }
}
</style>
