<template lang="pug">
  el-card
    div(slot="header", style="margin-bottom: 10px;")
      span 简历详情
      // el-button(type="primary", style="float: right;", @click="downloadResume") 下载
    div
      el-form(id="resume")
        el-form-item(label="员工工号:")
          span {{ skillForm.empnum }}
        el-form-item(label="员工姓名:")
          span {{ skillForm.empname }}
        el-form-item(label="所在岗位:")
          span {{ skillForm.identity }}
        el-form-item(label="联系方式:")
          span {{ skillForm.phone }}
        el-form-item(label="电子邮箱:")
          span {{ skillForm.email }}
        el-form-item(label="教育背景:")
          el-table(:data="skillForm.empeducation", border)
            el-table-column(property="starttime", label="入学日期")
              template(slot-scope="scope")
                span {{ formateTime(scope.row.starttime) }}
            el-table-column(property="endtime", label="毕业日期")
              template(slot-scope="scope")
                span {{ formateTime(scope.row.endtime) }}
            el-table-column(property="schoolname", label="就读学校")
            el-table-column(property="degree", label="学历")
            el-table-column(property="major", label="专业")
        el-form-item(label="工作技能:")
          span {{ skillForm.skill }}
        el-form-item.employee-project-style(label="项目经验:")
          span.project-item-style(v-for="(item, index) in skillForm.empprojects")
            div
              label ({{ index+1 }}) 项目名称:
              span &nbsp;&nbsp;{{ item.proname }}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目详情:
              span &nbsp;&nbsp;{{ item.prodetail }}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;担任角色:
              span &nbsp;&nbsp;{{ item.role }}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;角色贡献:
              span &nbsp;&nbsp;{{ item.rolecontribution}}
        el-form-item.employee-project-style(label="工作经验:")
          span.project-item-style(v-for="(item, index) in workdetail")
            div
              label ({{ index+1 }}) 就职公司:
              span &nbsp;&nbsp;{{ item.companyname }}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入职时间:
              span &nbsp;&nbsp;{{ formateTime(item.workstarttime) }}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离职时间:
              span &nbsp;&nbsp;{{ formateTime(item.workendtime) }}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所在部门:
              span &nbsp;&nbsp;{{ item.workdepartment}}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;担任职位:
              span &nbsp;&nbsp;{{ item.workpost}}
            div
              label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工作经验:
              span &nbsp;&nbsp;{{ item.experience}}
</template>
<script>
import staffService from '@/service/staffService'
import {formateTime} from '@/utils/common'

export default {
  data () {
    return {
      skillForm: {},
      workdetail: [],
      // skillList: [],
      isshow: false
    }
  },
  methods: {
    formateTime,
    // formateGrade (grade) {
    //   return grade / 20
    // },
    downloadResume () {
      let doc = ''
      let html = document.getElementById('resume').innerHTML
      doc += '<table>'
      doc += html
      doc += '</table>'
      let a = document.body.innerHTML
      let docFile = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:' + a + '" xmlns="http://www.w3.org/TR/REC-html40">'
      docFile = docFile + '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>' + doc + '</body></html>'
      let base64data = 'base64,' + window.btoa(unescape(encodeURIComponent(docFile)))
      window.open('data:application/msword;' + base64data, '_self')
    },
    getResumeDetail () {
      const empnum = this.$route.query.empnum
      staffService.getResume({ empnum: empnum }).then(res => {
        this.skillForm = res.obj
        // this.skillForm = { empnum: obj.empnum, empname: obj.empname, identity: obj.identity, phone: obj.phone, email: obj.email, education: obj.education }
        // this.skillList = obj.empskills
        // this.skillList.map((item, index) => {
        //   this.skillList[index].grade = this.formateGrade(item.grade)
        // })
      })
    },
    getWorkDetail () {
      const empnum = this.$route.query.empnum
      staffService.getAllWorkList({ empnum: empnum }).then(res => {
        this.workdetail = res.obj.list
      })
    }
  },
  created () {
    this.getResumeDetail()
    this.getWorkDetail()
  }
}
</script>

<style lang="less">
.employee-project-style {
  display: flex;
  flex-direction: row;
  .project-item-style {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
