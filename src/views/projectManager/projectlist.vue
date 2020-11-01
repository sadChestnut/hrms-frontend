<template lang="pug">
div
  el-card
    div(slot="header" class="clearfix")
      span 我的项目
      el-button(type="primary", icon="el-icon-plus",style="float: right; padding: 10px",@click="openDialog") 创建项目
    div
      el-form(:inline="true", :model="searchForm")
        el-form-item(label="项目名称")
          el-input.search-input-style(v-model="searchForm.proname")
        el-form-item(label="项目类别")
          el-select.search-input-style(v-model="searchForm.protype")
            el-option(v-for="(type, key) in typeList", :label="type", :key="key", :value="type")
        el-form-item(label="项目状态")
          el-select.search-input-style(v-model="searchForm.prostatus")
            el-option(v-for="status in proStatusLists", :label="status.text", :key="status.value", :value="status.value")
        el-form-item
          el-button(type="primary", @click="searchProject") 搜索
          el-button(@click="clearSearch") 重置
      el-table(stripe,style="width: 100%;margin-bottom: 20px;", :data="prjectList")
        el-table-column(prop="proname", label="项目名称")
        el-table-column(prop="protype", label="项目类别")
        el-table-column(prop="predicttime", label="预计起始日期")
          template(slot-scope="scope")
            span {{ formateTime(scope.row.predicttime) }}
        el-table-column(prop="certaintime", label="确定起始日期")
          template(slot-scope="scope")
            span {{ formateTime(scope.row.certaintime) }}
        el-table-column(prop="timelimit", label="预计项目工期")
          template(slot-scope="scope")
            span {{ scope.row.timelimit }} 个月
        el-table-column(prop="prostatus", label="项目状态")
          template(slot-scope="scope")
            el-tag(v-if="scope.row.prostatus === 1", type="success") 待启动
            el-tag(v-else-if="scope.row.prostatus === 2", type="success") 项目人员配置
            el-tag(v-else-if="scope.row.prostatus === 3", type="success") 开发中
            el-tag(v-else-if="scope.row.prostatus === 4", type="success") 测试中
            el-tag(v-else, type="success") 已交付
        el-table-column(fixed="right", label="操作", width="300")
          template(slot-scope="scope")
            el-button.operate-but-style(type="text", size="small", @click="getProjectDetail(scope.row.proid)") 编辑
            el-button.operate-but-style(type="text", size="small", @click="updateProStatus(scope.row.proid, scope.row.prostatus)") 更新状态
      el-pagination.pagination-style(
        background
        layout="prev, pager, next"
        :page-size="count"
        :total="total"
        @current-change="handleCurrentChange"
        :current-page="page"
      )
  // create-project(v-bind:isShowDialog="isShowDialog", @click="updateIsShow")
  update-status(:isShowDialog="isShowStatus", @click="isStatusShow",:proIdStatus="proIdStatus")
</template>
<script>
import projectService from '@/service/projectService'
import projectTypeService from '@/service/projectTypeService'
import createProject from './createProject'
import updateStatus from './updateStatus'
import {formateTime} from '@/utils/common'
export default {
  data () {
    return {
      prjectList: [],
      searchForm: {
        proname: '',
        protype: '',
        prostatus: 3
      },
      typeList: [],
      proStatusLists: [
        {
          text: '待启动',
          value: 1
        },
        {
          text: '项目人员配置',
          value: 2
        },
        {
          text: '开发中',
          value: 3
        },
        {
          text: '测试中',
          value: 4
        },
        {
          text: '已交付',
          value: 5
        }
      ],
      isShowDialog: false,
      isShowStatus: false,
      proIdStatus: {
        projectid: '',
        projectstatus: 0
      },
      page: 1,
      count: 5,
      total: 0
    }
  },
  components: { createProject, updateStatus },
  methods: {
    formateTime,
    handleCurrentChange (page) {
      this.page = page
      this.getList(page)
    },
    openDialog () {
      // this.isShowDialog = true
      this.$router.push({name: 'project.add'})
    },
    updateIsShow (data) {
      this.isShowDialog = data
      this.searchProject()
    },
    isStatusShow (data) {
      this.isShowStatus = data
      this.searchProject()
    },
    // getTableLists () {
    //   let empnum = window.localStorage.getItem('empnum')
    //   projectService.getProjectList({empnum: empnum}).then(res => {
    //     this.prjectList = res.obj.list
    //   })
    //   this.searchProject()
    // },
    getProjectDetail (proid) {
      // let routeData = this.$router.resolve({ path: '/project/detail', query: { proid: proid } })
      // window.open(routeData.href, '_blank')
      this.$router.push({name: 'project.detail', params: { proid: proid }})
    },
    updateProStatus (proid, prostatus) {
      this.proIdStatus.projectid = proid
      this.proIdStatus.projectstatus = prostatus
      this.isShowStatus = true
    },
    clearSearch () {
      this.searchForm = {
        proname: '',
        protype: '',
        prostatus: ''
      }
    },
    searchProject () {
      this.page = 1
      this.getList()
    },
    getList () {
      projectService.searchProject({ ...this.searchForm, page: this.page, count: this.count, empnum: window.localStorage.getItem('empnum'), showhasdone: true }).then(res => {
        if (res.msg === '0') {
          this.prjectList = res.obj.content
          this.total = res.obj.totalElements
        }
      })
    },
    getProjectTypeList () {
      projectTypeService.getProjectTypeList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          this.typeList.push(item.projecttypename)
        })
      })
    }
  },
  created () {
    this.getList()
    this.getProjectTypeList()
  },
  watch: {
    isShowDialog: {
      handler (newVal, oldVal) {
        this.$set(this, 'isShowDialog', newVal)
      },
      deep: true
    },
    isShowStatus: {
      handler (newVal, oldVal) {
        this.$set(this, 'isShowStatus', newVal)
      },
      deep: true
    },
    proIdStatus: {
      handler (newVal, oldVal) {
        this.$set(this, 'proIdStatus', newVal)
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.clearfix {
  &::after, &::before {
    display: table;
    content: "";
  }
  &::after {
    clear: both
  }
}
.search-input-style {
  width: 180px;
}
.operate-but-style {
  font-size: 14px;
}
</style>
