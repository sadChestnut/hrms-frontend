<template lang="pug">
div
  el-dialog(title="创建项目",:visible="isShow", :before-close="closeDialog")
    el-form(label-width="115px", :model="projectForm", status-icon, :rules="rules")
      el-form-item(label="项目名称", prop="proname")
        el-input(style="width:300px", v-model="projectForm.proname")
      el-form-item(label="项目类别", prop="protype")
        el-select(style="width:300px", v-model="projectForm.protype", placeholder="请选择项目类别")
          el-option(v-for="(type, key) in typeList", :label="type", :key="key", :value="type")
      el-form-item(label="项目背景", prop="probackground")
        el-input(type="textarea", :rows="4", style="width:300px", v-model="projectForm.probackground")
      el-form-item(label="预计起始日期", prop="predicttime")
        el-date-picker(type="date", v-model="projectForm.predicttime", placeholder="选择预计起始日期", style="width:300px")
      el-form-item(label="确定起始日期", prop="certaintime")
        el-date-picker(type="date", v-model="projectForm.certaintime", placeholder="选择确定起始日期", style="width:300px")
      el-form-item(label="预计项目工期", prop="timelimit", required)
        el-input-number(:min="1",:max="12", v-model="projectForm.timelimit")
        span.predict-project-time 月
      el-form-item(label="技能列表", required)
        el-tag(:key="item", v-for="(tag, item) in skillLists", closable, :disable-transitions="false", @close="handleClose(tag)") {{ tag }}
        el-input(class="input-new-tag", v-if="inputVisible", v-model="inputValue", ref="saveTagInput", size="small", @keyup.enter.native="handleInputConfirm", @blur="handleInputConfirm")
        el-button(v-else, class="button-new-tag", @click="showInput") + 新标签
      el-form-item(label="职位需求", required)
        div(v-for="(item, index) in postLists")
          label(style="display:inline-block; width:50px") 职位
          el-select(style="width:150px", v-model="item.post")
            el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
          label(style="display:inline-block; width:50px; margin-left:10px;") 人数
          el-input-number(v-model="item.number", :min="1", :max="20", style="width:150px")
          el-button(icon="el-icon-plus",type="primary",circle, style="display:inline-block; margin-bottom: 10px; margin-left:20px;", @click="addPostList(index)")
          el-button(icon="el-icon-minus",circle, style="display:inline-block", @click="removePostList(index)", :disabled="isRemovePost")
    div(slot="footer")
      el-button(@click="closeDialog") 取 消
      el-button(type="primary", @click="submitProjectInfo") 确 定
</template>
<script>
import projectService from '@/service/projectService'
import moment from 'moment'
export default {
  name: 'createProject',
  data () {
    return {
      projectForm: {
        proname: '',
        protype: '',
        probackground: '',
        predicttime: '',
        certaintime: '',
        timelimit: 1
      },
      typeList: ['管理系统', '微信小程序', 'APP', '网站开发'],
      roleList: [
        {
          label: '前端工程师',
          value: '前端工程师'
        },
        {
          label: '后端工程师',
          value: '后端工程师'
        },
        {
          label: '测试工程师',
          value: '测试工程师'
        },
        {
          label: '需求分析师',
          value: '需求分析师'
        }
      ],
      rules: {
        proname: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        protype: [
          { required: true, message: '请输入项目类别', trigger: 'change' }
        ],
        probackground: [
          { required: true, message: '请输入项目背景', trigger: 'blur' }
        ],
        predicttime: [
          { required: true, message: '请输入预计起始日期' }
        ],
        certaintime: [
          { required: true, message: '请输入确定起始日期' }
        ],
        timelimit: [
          { required: true, message: '请输入预计项目工期', trigger: 'change' }
        ]
      },
      skillLists: [],
      inputVisible: false,
      inputValue: '',
      postLists: [
        {
          post: '',
          number: 0
        }
      ],
      isShow: this.isShowDialog
    }
  },
  props: {
    isShowDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isRemovePost: function () {
      return this.postLists.length <= 1
    }
  },
  methods: {
    handleClose (tag) {
      this.skillLists.splice(this.skillLists.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.skillLists.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    addPostList (index) {
      this.postLists.splice(index + 1, 0, {post: '', number: 0})
    },
    removePostList (index) {
      this.postLists.splice(index, 1)
    },
    closeDialog () {
      this.isShow = false
      this.$emit('click', this.isShow)
    },
    submitProjectInfo () {
      let formInfo = JSON.parse(JSON.stringify(this.projectForm))
      formInfo.certaintime = moment(this.projectForm.certaintime).valueOf()
      formInfo.predicttime = moment(this.projectForm.predicttime).valueOf()
      const params = {
        ...formInfo,
        skilllists: this.skillLists.join(','),
        postlists: JSON.parse(JSON.stringify(this.postLists)),
        empnum: window.localStorage.getItem('empnum')
      }
      projectService.saveProInfo({...params}).then(res => {
        if (res.msg === '0') {
          this.$message.success('项目创建成功')
        }
      }).then(() => {
        this.closeDialog()
      })
    }
  },
  watch: {
    isShowDialog: {
      handler (newVal, oldVal) {
        this.$set(this, 'isShow', newVal)
      },
      deep: true
    }
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
.predict-project-time {
  display: inline-block;
  width: 60px;
  text-align: right;
}
</style>
