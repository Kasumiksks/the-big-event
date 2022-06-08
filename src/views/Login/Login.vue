<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title"></div>
      <el-form ref="loginForm" :model="loginForm" :rules='loginRules'>
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" round class="btn-login" @click="checkLogin">登录</el-button>
      </el-form>
      <el-link type="primary" @click="$router.push('/reg')">没有账号?去注册</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z][a-zA-Z0-9]{0,9}$/, message: '用户名必须是1-10的字母数字,数字不能开头', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    checkLogin () {
      // 兜底校验
      this.$refs.loginForm.validate(async (valid) => {
      //  valid返回值是boolean 只有所有的表单项验证通过返回的是true
      // 只要一个表单项没有验证通过，返回false
        if (!valid) return alert('注册失败, 输入内容不符合规范')// 校验没有通过
        // 发送请求
        const { data: res } = await this.$http({
          method: 'post',
          url: '/api/login',
          data: this.loginForm
        })
        console.log(res)
        // 注册失败,返回
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        // 注册成功
        this.$message.success(res.message)
        // 跳转后台首页
        this.$router.push('/main')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  height: 100%;
  background: url(../../assets/images/login_bg.jpg) center;
  background-size:cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box{
  padding: 0 50px;
  width: 400px;
  height: 350px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.1);
  .login-title{
    width: 100%;
    height: 60px;
    background: url(../../assets/images/login_title.png) no-repeat center;
  }
  .btn-login {
      width: 100%;
    }
}
</style>
