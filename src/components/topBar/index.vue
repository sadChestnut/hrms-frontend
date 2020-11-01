<template>
  <div class="top-bar">
    <div class="top-bar-title">人力资源配置管理系统</div>
    <div class="top-bar-content">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          欢迎您，{{ user }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">登出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div>
        <!-- <img src="../../assets/logout.svg" alt="logout" @click="userLogout" class="logout-icon-style"> -->
        <!-- <el-badge :value="message" class="item">
          <el-button type="primary" icon="el-icon-message" @click="getConfigPlan(user)"></el-button>
        </el-badge> -->
      </div>
    </div>
  </div>
</template>
<script>
// import projectService from '@/service/projectService'
export default {
  name: 'topBar',
  data () {
    return {
      user: window.localStorage.getItem('empnum'),
      message: ''
      // datalist: []
    }
  },
  methods: {
    getConfigPlan (empnum) {
      // 打开一个消息提醒
      console.log(empnum)
    },
    userLogout () {
      this.$auth.logout().then(() => {
        this.$router.push('/login')
      })
    },
    handleCommand (command) {
      switch (command) {
        case 'modifyPassword':
          this.$router.push({ name: 'account.modifypassword' })
          break
        case 'logout':
          this.userLogout()
          break
      }
    }
  }
  // created () {
  //   projectService.getAllProjects({ prostatus: 2 }).then((res) => {
  //     this.datalist = res.obj.list
  //   })
  // }
}
</script>

<style lang="less" scoped>
.top-bar {
  height: 80px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .top-bar-title {
    font-size: 20px;
    font-style: italic;
  }
  .top-bar-content {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    .el-button {
      margin: 5px 0;
      padding: 5px;
    }
    .logout-icon-style {
      margin-top: 5px;
      width: 20px;
      height: 20px;
    }
    .el-dropdown-link {
      cursor: pointer;
      // color: #409EFF;
      margin-right: 10px;
      font-size: 15px;
    }
    .el-icon-arrow-down {
      font-size: 18px;
    }
  }
}
</style>
