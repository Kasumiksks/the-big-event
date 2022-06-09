<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="userFormRules"
      label-width="80px"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitMsg">提交修改</el-button>
        <el-button @click="resetMsg">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo',
  data () {
    return {
      // 保存数据的表单对象
      /*  userForm: {
        username: '',
        nickname: '',
        email: ''
      }, */
      // 因为v-model和userForm是双向绑定，如果直接将vuex中地址给到userForm，那么当表单数据改变就会改变vuex里面的数据
      // 所以此处使用展开运算符
      userForm: { ...this.$store.state.userInfo },
      // 表单验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitMsg () {
      this.$refs.userForm.validate(async (valid) => {
        if (!valid) return this.$message.error('提交失败!请检查输入')
        const { data: res } = await this.$http({
          method: 'put',
          url: '/my/userinfo',
          data: this.userForm
        })
        console.log(res)
        if (res.code !== 0) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        // 重新渲染
        this.$store.dispatch('getUserInfo')
      })
    },
    resetMsg () {
      this.userForm = { ...this.$store.state.userInfo }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
