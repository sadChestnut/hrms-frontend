<template lang="pug">
  el-card
    div(slot="header" class="clearfix")
      span {{ this.$route.params.proname }} 职位需求详情
    el-form(label-width="100px")
      el-form-item(label="职位需求详情")
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
        el-button(type="primary", @click="okInfo", :disabled="!ischange") 确定
</template>
<script>
import positionService from '@/service/positionService'
import projectService from '@/service/projectService'
import staffService from '@/service/staffService'
import messageService from '@/service/messageService'
export default {
  data () {
    return {
      roleList: [],
      postLists: this.$route.params.pLists,
      ischange: false
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'project.procheck' })
    },
    okInfo () {
      projectService.updatePropost(JSON.stringify(this.postLists)).then(res => {
        if (res.msg === '0') {
          this.$message.success('职位需求修改成功')
          this.goBack()
          this.sendMessage()
        }
      })
    },
    sendMessage () {
      const send = window.localStorage.getItem('empnum')
      const proid = this.$route.params.proid
      let sendname
      let acceptname
      staffService.getResume({empnum: send}).then(res => {
        sendname = res.obj.empname
      }).then(() => {
        staffService.getResume({empnum: 3001}).then(res => {
          acceptname = res.obj.empname
        }).then(() => {
          const params = {
            send: send,
            sendname: sendname,
            accept: 3001,
            acceptname: acceptname,
            empnum: '',
            empname: '',
            proid: proid,
            identity: '',
            status: 4,
            ischeck: 0,
            senddate: new Date().getTime(),
            reason: ''
          }
          messageService.saveMessageInfo({ ...params }).then(res => {})
        })
      })
    },
    addPostList (index) {
      this.postLists.splice(index + 1, 0, {post: '', number: 0, proid: this.$route.params.proid, skill: ''})
    },
    removePostList (index) {
      this.postLists.splice(index, 1)
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
    this.getRoleList()
  },
  computed: {
    isRemovePost: function () {
      return this.postLists.length <= 1
    }
  },
  watch: {
    postLists: {
      handler: function (newVal, oldVal) {
        this.ischange = true
      },
      deep: true
    }
  }
}
</script>
<style lang="less">

</style>
