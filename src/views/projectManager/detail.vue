<template lang="pug">
  el-card
    div(slot="header")
      span {{ viewType === 'detail' ? '编辑项目' : '创建项目' }}
    div
      el-form(label-width="120px", :model="projectForm", :rules="rules")
        el-form-item(label="项目名称", prop="proname")
          el-input(style="width:300px", v-model="projectForm.proname")
        el-form-item(label="项目类别", prop="protype")
          el-select(style="width:300px", v-model="projectForm.protype")
            el-option(v-for="(type, key) in typeList", :label="type", :key="key", :value="type")
        el-form-item(label="项目背景", prop="probackground")
          el-input(type="textarea", :rows="4", style="width:300px", v-model="projectForm.probackground")
        el-form-item(label="项目相关材料")
          el-upload(
            class="upload-demo"
            action="http://localhost:8080/api/file/upload"
            :before-remove="beforeRemove"
            :on-success="handleAvatarSuccess"
            multiple
            :limit="5"
            :file-list="fileList"
          )
            el-button(size="small", type="primary") 点击上传
            div.el-upload__tip(slot="tip") 最多上传5个文件，且不超过10MB
        el-form-item(label="已上传文件列表")
          span(v-for="(item, index) in uploadFileList", :key="index") {{ item.filename }};&nbsp;&nbsp;
          el-button(v-if="uploadFileList.length > 0", type="primary", size="small", style="display: block;", @click="downloadFile") 点击下载文件
        el-form-item(label="预计起始日期", prop="predicttime")
          el-date-picker(type="date", v-model="projectForm.predicttime", placeholder="选择预计起始日期", style="width:300px")
        el-form-item(label="确定起始日期", prop="certaintime")
          el-date-picker(type="date", v-model="projectForm.certaintime", placeholder="选择确定起始日期", style="width:300px")
        el-form-item(label="预计项目工期", prop="timelimit", required)
          el-input-number(:min="1",:max="12", v-model="projectForm.timelimit")
          span.predict-project-time 月
        // el-form-item(label="技能列表", required)
        //   el-tag(:key="item", v-for="(tag, item) in skillLists", closable, :disable-transitions="false", @close="handleClose(tag)") {{ tag }}
        //   el-input(class="input-new-tag", v-if="inputVisible", v-model="inputValue", ref="saveTagInput", size="small", @keyup.enter.native="handleInputConfirm", @blur="handleInputConfirm")
        //   el-button(v-else, class="button-new-tag", @click="showInput") + 新标签
        el-form-item(label="职位需求", required, v-if="viewType !== 'detail'")
          div(v-for="(item, index) in postLists")
            label(style="display:inline-block; width:70px") 技能要求
            el-input(style="width:280px", v-model="item.skill")
            label(style="display:inline-block; width:50px; margin-left:10px;") 职位
            el-select(style="width:180px", v-model="item.post")
              el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
            label(style="display:inline-block; width:50px; margin-left:10px;") 人数
            el-input-number(v-model="item.number", :min="1", :max="20", style="width:150px")
            el-button(icon="el-icon-plus",type="primary",circle, style="display:inline-block; margin-bottom: 10px; margin-left:20px;", @click="addPostList(index)")
            el-button(icon="el-icon-minus",circle, style="display:inline-block", @click="removePostList(index)", :disabled="isRemovePost")
        el-form-item
          el-button(@click="goBack") 返回
          el-button(type="primary", @click="updateInfo", v-show="isShowUpdate", :disabled="isSubmit") 确定
          el-button(type="primary", :loading="true", v-show="isShowLoading") 加载中
</template>

<script>
import projectService from '@/service/projectService'
import projectTypeService from '@/service/projectTypeService'
import positionService from '@/service/positionService'
import moment from 'moment'
import axios from 'axios'
import {download} from '@/utils/common.js'

export default {
  data () {
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      projectForm: {
        proname: '',
        protype: '',
        probackground: '',
        predicttime: '',
        timelimit: '',
        certaintime: '',
        filelists: ''
      },
      typeList: [],
      rules: {
        proname: [
          { required: true, message: '请输入项目名称' }
        ],
        protype: [
          { required: true, message: '请输入项目类别' }
        ],
        probackground: [
          { required: true, message: '请输入项目背景' }
        ],
        predicttime: [
          { required: true, message: '请输入预计起始日期' }
        ],
        certaintime: [
          { required: true, message: '请输入确定起始日期' }
        ]
      },
      // skillLists: [],
      inputVisible: false,
      inputValue: '',
      postLists: [
        {
          post: '',
          number: 0
        }
      ],
      isShowLoading: false,
      isShowUpdate: true,
      roleList: [],
      fileList: [],
      uploadFileList: []
    }
  },
  computed: {
    isRemovePost: function () {
      return this.postLists.length <= 1
    },
    isSubmit: function () {
      if (!this.projectForm.proname || !this.projectForm.protype || !this.projectForm.probackground || !this.projectForm.predicttime || !this.projectForm.certaintime || !this.projectForm.timelimit) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // handleClose (tag) {
    //   this.skillLists.splice(this.skillLists.indexOf(tag), 1)
    // },
    download,
    downloadFile () {
      let _this = this
      let filelists = this.projectForm.filelists ? this.projectForm.filelists.split(';') : []
      filelists.forEach(item => {
        axios({
          method: 'post',
          url: 'http://localhost:8080/api/file/download',
          data: {
            filename: item
          },
          responseType: 'blob'
        }).then(res => {
          let arr = item.split('-')
          _this.download(res.data, arr[arr.length - 1])
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    handleAvatarSuccess (res, file) {
      this.uploadFileList.push({severName: res.code, filename: file.name})
    },
    beforeRemove (file, fileList) {
      this.$confirm(`确定移除 ${file.name} ？`).then(() => {
        this.uploadFileList.splice(this.uploadFileList.findIndex(item => item.filename === file.name), 1)
      }).catch(() => {})
      console.log('移除后' + this.uploadFileList)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // handleInputConfirm () {
    //   let inputValue = this.inputValue
    //   if (inputValue) {
    //     this.skillLists.push(inputValue)
    //   }
    //   this.inputVisible = false
    //   this.inputValue = ''
    // },
    addPostList (index) {
      this.postLists.splice(index + 1, 0, {post: '', number: 0})
    },
    removePostList (index) {
      this.postLists.splice(index, 1)
    },
    goBack () {
      this.$router.push({name: 'project.myproject'})
    },
    updateInfo () {
      this.isShowLoading = true
      this.isShowUpdate = false
      let formInfo = JSON.parse(JSON.stringify(this.projectForm))
      formInfo.certaintime = moment(this.projectForm.certaintime).valueOf()
      formInfo.predicttime = moment(this.projectForm.predicttime).valueOf()
      let filelists = []
      this.uploadFileList.forEach(item => {
        filelists.push(item.severName)
      })
      const params = {
        ...formInfo,
        proid: this.$route.params.proid ? this.$route.params.proid : '',
        // skilllists: this.skillLists.join(','),
        postlists: JSON.parse(JSON.stringify(this.postLists)),
        empnum: window.localStorage.getItem('empnum'),
        filelists: filelists.join(';')
      }
      if (this.viewType === 'detail') {
        projectService.updateProInfo({ ...params }).then(res => {
          if (res.msg === '0') {
            this.$message.success('保存成功')
            this.goBack()
          }
        }).then(() => {
          this.isShowLoading = false
          this.isShowUpdate = true
        })
      } else {
        delete params.proid
        projectService.saveProInfo({...params}).then(res => {
          if (res.msg === '0') {
            this.$message.success('项目创建成功')
            this.goBack()
          }
        }).then(() => {
          this.isShowLoading = false
          this.isShowUpdate = true
        })
      }
    },
    getProjectTypeList () {
      projectTypeService.getProjectTypeList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          this.typeList.push(item.projecttypename)
        })
      })
    },
    getRoleList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          if (item.positionname !== 'hr' && item.positionname !== '项目经理') {
            this.roleList.push({ text: item.positionname, value: item.positionname })
          }
        })
      })
    }
  },
  created () {
    if (this.$route.params && this.$route.params.proid) {
      projectService.getProjectDetail({ proid: this.$route.params.proid }).then(res => {
        let obj = res.obj
        this.projectForm = { proname: obj.proname, protype: obj.protype, probackground: obj.probackground, predicttime: obj.predicttime, certaintime: obj.certaintime, timelimit: obj.timelimit, filelists: obj.filelists }
        // this.skillLists = obj.skilllists.split(',')
        this.postLists = obj.postlists
        if (obj.filelists) {
          obj.filelists.split(';').forEach(item => {
            let filename = item.split('-')
            this.uploadFileList.push({severName: item, filename: filename[filename.length - 1]})
          })
        }
      })
    }
    this.getProjectTypeList()
    this.getRoleList()
  }
}
</script>
<style lang="less">
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
</style>
