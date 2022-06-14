<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img :src="avatar" alt="" class="preview" v-if="avatar"/>
      <img src="../../../assets/images/avatar.jpg" alt="" class="preview" v-else/>
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="chooseImg"
        />
        <el-button type="primary" icon="el-icon-plus" @click="triggerFile"
          >选择图片</el-button
        >
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''"
          @click="submitImg">上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    triggerFile () {
      this.$refs.iptRef.click()
    },
    chooseImg (e) {
      // 获取用户选择的图片
      const file = e.target.files[0]
      // 创建FileReader对象
      const fileReader = new FileReader()
      // 调用readAsDataURL函数读取文件内容
      fileReader.readAsDataURL(file)
      // 监听onload事件，读取完成触发回调函数
      fileReader.onload = () => {
        // 将图片转换为base64字符串
        this.avatar = fileReader.result
      }
    },
    async submitImg () {
      const { data: res } = await this.$http({
        method: 'patch',
        url: '/my/update/avatar',
        data: { avatar: this.avatar }
      })
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 更新页面
      this.$store.dispatch('user/getUserInfo')
      this.avatar = ''
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
