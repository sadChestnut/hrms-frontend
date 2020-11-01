<template lang="pug">
  el-card
    div.clearfix(slot="header")
      span 个人技能信息
      // el-button(type="primary", style="float: right;", @click="downloadResume") 下载
    div
      el-form(label-width="80px", :model="skillForm", :rules="rules", status-icon, ref="resume")
        el-form-item(label="员工工号", prop="empnum")
          el-input(style="width:300px", v-model="skillForm.empnum", disabled)
        el-form-item(label="员工姓名", prop="empname")
          el-input(style="width:300px", v-model="skillForm.empname")
        el-form-item(label="所在岗位", prop="identity")
          el-select(style="width:300px", v-model="skillForm.identity")
            el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
        el-form-item(label="联系方式", prop="phone")
          el-input(style="width:300px", v-model="skillForm.phone")
        el-form-item(label="电子邮箱", prop="email")
          el-input(style="width:300px", v-model="skillForm.email")
        el-form-item(label="教育背景",prop="education")
          span(@click="editEducationDetail").edit-project-style 添加教育背景>>
        el-form-item.skill-grade-style(label="掌握技能", prop="skill")
          el-input.skill-input-style(type="textarea", :rows="8", v-model="skillForm.skill", style="font-size: 15px;")
        el-form-item(label="工作经验", v-if="viewType === 'edit'")
          span(@click="editWorkDetail").edit-project-style 添加工作经验>>
        el-form-item(label="项目经验")
          span(@click="editProDetail").edit-project-style 添加项目经验>>
        el-form-item
          el-button(@click="goBack", v-if="viewType==='edit'") 返回
          el-button(type="primary", @click="submitInfo",v-show="isShowSubmit") 提交
          el-button(type="primary", :loading="true", v-show="isShowLoading") 提交中
</template>
<script>
import staffService from '@/service/staffService'
import positionService from '@/service/positionService'
import moment from 'moment'
export default {
  data () {
    var valiPhone = (rule, value, callback) => {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error('联系方式格式错误'))
      } else {
        callback()
      }
    }
    var valiEmail = (rule, value, callback) => {
      if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
        callback(new Error('电子邮箱格式错误'))
      } else {
        callback()
      }
    }
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      skillForm: {
        empnum: '',
        empname: '',
        phone: '',
        email: '',
        identity: '',
        skill: ''
      },
      empeducation: [
        {
          starttime: '',
          endtime: '',
          schoolname: '',
          degree: '',
          major: '',
          empnum: window.localStorage.getItem('empnum')
        }
      ],
      roleList: [],
      educationList: [
        {
          label: '本科',
          value: '本科'
        },
        {
          label: '专科',
          value: '专科'
        },
        {
          label: '硕士',
          value: '硕士'
        },
        {
          label: '博士',
          value: '博士'
        }
      ],
      isShowLoading: false,
      isShowSubmit: true,
      rules: {
        email: [
          { validator: valiEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: valiPhone, trigger: 'blur' }
        ]
      },
      isSendEmail: true
    }
  },
  methods: {
    goBack () {
      this.viewType === 'edit' ? this.$router.push({ name: 'resume.list' }) : this.$router.push({ name: 'staffResume.detail' })
    },
    editEducationDetail () {
      let empnum = this.viewType === 'edit' ? this.$route.params.empnum : window.localStorage.getItem('empnum')
      let params = { empnum: empnum, empname: this.skillForm.empname, identity: this.skillForm.identity, email: this.skillForm.email, phone: this.skillForm.phone, skill: this.skillForm.skill }
      this.viewType === 'edit' ? this.$router.push({ name: 'staffResume.initialEduDetail', params: params }) : this.$router.push({ name: 'staffResume.edudetail', params: params })
    },
    // addEducation (index) {
    //   this.empeducation.splice(index + 1, 0, { starttime: '', endtime: '', schoolName: '', degree: '', major: '', empnum: window.localStorage.getItem('empnum') })
    // },
    removeEducation (index) {
      if (index === 0) {
        return
      }
      this.empeducation.splice(index, 1)
    },
    editProDetail () {
      let empnum = this.viewType === 'edit' ? this.$route.params.empnum : window.localStorage.getItem('empnum')
      let params = { empnum: empnum, empname: this.skillForm.empname, identity: this.skillForm.identity, email: this.skillForm.email, phone: this.skillForm.phone, skill: this.skillForm.skill }
      this.viewType === 'edit' ? this.$router.push({ name: 'staffResume.initialProInfo', params: params }) : this.$router.push({ name: 'staffResume.prodetail', params: params })
    },
    editWorkDetail () {
      let params = { empnum: this.$route.params.empnum, empname: this.skillForm.empname, identity: this.skillForm.identity, email: this.skillForm.email, phone: this.skillForm.phone, skill: this.skillForm.skill }
      this.$router.push({ name: 'staffResume.workdetail', params: params })
    },
    submitInfo () {
      this.isShowSubmit = false
      this.isShowLoading = true
      staffService.updateResume({ ...this.skillForm }).then(res => {
        if (res.msg === '0') {
          this.$message.success('简历更新成功')
        }
      }).then(() => {
        this.isShowLoading = false
        this.isShowSubmit = true
        this.goBack()
      })
    },
    downloadResume () {
      let inner = ''
      const dom = this.$refs.resume.$children
      dom.map(item => {
        if (item.label === '技能及等级') {
          if (item.label) {
            inner += '<div><label>' + item.label + ':</label>'
            item.$children.map(child => {
              if (child.value) {
                inner += '<span>' + child.value + ' ' + '</span>'
              }
            })
            inner += '</div>'
          }
        } else if (item.label === '项目经验') {
          inner += '<div><div>' + item.label + ':</div>'
          item.$children.map(child => {
            if (typeof (child.label) !== 'undefined') {
              inner += '<div><label>' + child.label + ':</label>'
              child.$children.map(cchild => {
                inner += '<span>' + cchild.value + '</span></div>'
              })
            }
          })
          inner += '</div>'
        } else if (typeof (item.label) !== 'undefined') {
          inner += '<div><label>' + item.label + ':</label><span>' + item.fieldValue + '</span></div>'
        }
      })
      let doc = ''
      doc += '<table>'
      doc += inner
      doc += '</table>'
      let a = document.body.innerHTML
      let docFile = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:' + a + '" xmlns="http://www.w3.org/TR/REC-html40">'
      docFile = docFile + '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>' + doc + '</body></html>'
      let base64data = 'base64,' + window.btoa(unescape(encodeURIComponent(docFile)))
      window.open('data:application/msword;' + base64data)
    },
    getDiffTime (endtime, email) {
      let diff = moment(endtime).add(3, 'months').diff(moment())
      if (diff < 0 && email !== '') {
        staffService.sendEmail({sendTo: email}).then(() => {})
      }
    },
    getResumeInfo () {
      let empnum = this.viewType === 'edit' ? this.$route.params.empnum : window.localStorage.getItem('empnum')
      staffService.getResume({empnum: empnum}).then(res => {
        let obj = res.obj
        if (obj === null) {
          this.skillForm.empnum = window.localStorage.getItem('empnum')
          return false
        } else {
          this.skillForm = { empnum: obj.empnum, empname: this.$route.params.empname && this.$route.params.empname !== '' ? this.$route.params.empname : obj.empname, identity: this.$route.params.identity && this.$route.params.identity !== '' ? this.$route.params.identity : obj.identity, phone: this.$route.params.phone && this.$route.params.phone !== '' ? this.$route.params.phone : obj.phone, email: this.$route.params.email && this.$route.params.email !== '' ? this.$route.params.email : obj.email, skill: this.$route.params.skill && this.$route.params.skill !== '' ? this.$route.params.skill : obj.skill }
          this.empeducation = obj.empeducation.length === 0 ? [{ starttime: '', endtime: '', schoolName: '', degree: '', major: '', empnum: empnum }] : obj.empeducation
          if (this.viewType !== 'edit') {
            this.getDiffTime(obj.updatetime, obj.email)
          }
        }
      })
    },
    getRoleList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          this.roleList.push({ text: item.positionname, value: item.positionname })
        })
      })
    }
  },
  computed: {
    isRemoveEducation: function () {
      return this.empeducation.length <= 1
    }
  },
  created () {
    this.getResumeInfo()
    this.getRoleList()
  }
}
</script>
<style lang="less">
.clearfix {
  &::before, &::after {
    display: table;
    content: "";
  }
  &::after {
    clear: both;
  }
}
.skill-grade-style {
  .skill-input-style {
    width: 500px;
  }
}
.project-style {
  display: inline-block;
  .el-form-item__label {
    width: 80px !important;
  }
  .el-form-item__content {
    margin-left: 80px !important;
  }
}
.edit-project-style {
  color: #409EFF;
  cursor: pointer;
}
.project-list-style {
  vertical-align: top;
}
</style>
