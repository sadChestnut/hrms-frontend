<template lang="pug">
div
  img.background-login-style(src="../../assets/bg.jpg")
  h1 人力资源配置管理系统
  form.form-class(@submit.prevent='submit', autocomplete='off')
    div.form-item-style(style="margin-top: 20px;")
      label.form-label 工号
      input(v-model="loginForm.empnum", autocomplete='off').form-input
    div.form-item-style
      label.form-label 密码
      input(type="password", v-model="loginForm.password").form-input
    div.form-item-style
      label.form-label 验证码
      input.form-input.valicode-input(v-model="loginForm.valicode", type="text")
      img.vali-img-style(:src="imgurl", @click="changeImg")
    div(style="text-align: center;")
      button(type='submit',:disabled='!loginForm.password || !loginForm.empnum').login-button-style 登 陆
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        empnum: '',
        password: '',
        valicode: ''
      },
      imgurl: 'http://localhost:8080/api/validateCode'
    }
  },
  methods: {
    submit () {
      const params = {
        empnum: this.loginForm.empnum,
        password: this.loginForm.password,
        valicode: this.loginForm.valicode
      }
      this.$auth.login(params).then(res => {
        if (res.msg === '0') {
          window.localStorage.setItem('empnum', this.loginForm.empnum)
          this.$router.push('/')
        } else {
          this.$message.error(res.code)
        }
      })
    },
    changeImg () {
      let url = this.imgurl
      let newurl = this.changeUrl(url)
      this.imgurl = newurl
    },
    changeUrl (url) {
      let timestamp = (new Date()).valueOf()
      let index = url.indexOf('?')
      if (index > 0) {
        url = url.substring(0, index)
      }
      if ((url.indexOf('&') >= 0)) {
        url += '&tamp=' + timestamp
      } else {
        url += '?timestamp=' + timestamp
      }
      return url
    }
  }
}
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
}
.background-login-style {
  display: inline-block;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  opacity: 0.9;
}
h1 {
  top: 5%;
  position: absolute;
  color: #000000;
  opacity: 0.8;
  width: 100%;
  text-align: center;
  font-size: 2.6em;
  margin-left: -20px;
}
.form-class {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-200px, -200px);
  z-index: 1001;
  width: 350px;
  height: 350px;
  border-radius: 10px;
  text-align: left;
  background: rgba(16, 16, 16, 0.6);
  .form-item-style {
    height: 80px;
    line-height: 80px;
  }
  .form-label {
    display: inline-block;
    color: #ffffff;
    font-size: 25px;
    width: 80px;
    vertical-align: middle;
    margin-left: 15px;
    margin-right: 10px;
    // opacity: 0.9;
    font-weight: bold;
  }
  .form-input {
    border-style: none;
    width: 210px;
    height: 50px;
    border-radius: 5px;
    padding-left: 10px;
    font-size: 18px;
    // opacity: 0.9;
    border: 2px solid rgba(56, 55, 55, 1);
    background: transparent;
  }
  .valicode-input {
    width: 100px;
  }
  .vali-img-style {
    width: 100px;
    height: 40px;
    vertical-align: middle;
    margin-left: 10px;
    border: 1px solid rgba(56, 55, 55, 0.9);
  }
  .login-button-style {
    width: 310px;
    height: 50px;
    background: #409EFF;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    margin-top: 20px;
    opacity: 0.9;
    font-size: 20px;
  }
}
</style>
