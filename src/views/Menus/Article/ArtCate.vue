<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisible = true"
          >添加分类</el-button
        >
        <!-- 监听对话框的 `closed` 事件 -->
        <el-dialog
          title="添加文章分类"
          :visible.sync="addVisible"
          width="35%"
          @closed="resetForm"
        >
          <!-- 添加的表单 -->
          <el-form :model="addForm" :rules="addRules" ref="addRef">
            <el-form-item label="分类名称" prop="cate_name">
              <el-input
                v-model="addForm.cate_name"
                minlength="1"
                maxlength="10"
              ></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="cate_alias">
              <el-input
                v-model="addForm.cate_alias"
                minlength="1"
                maxlength="15"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="addVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="addCate"
              >添 加</el-button
            >
          </span>
        </el-dialog>
      </div>
      <!-- 表格区域 -->
      <el-table style="width: 100%" :data="ArtList" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"> </el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(row.id)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="delCate(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改文章的对话框 -->
      <el-dialog
        title="修改文章分类"
        :visible.sync="editVisible"
        width="35%"
        @closed="resetEditForm"
      >
        <!-- 修改的表单 -->
        <el-form
          :model="editForm"
          :rules="addRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="editForm.cate_name"></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="editForm.cate_alias"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  created () {
    this.getArtList()
  },
  data () {
    return {
      // 文章分类列表
      ArtList: [],
      addVisible: false,
      editVisible: false,
      // 添加的表单
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 修改的表单
      editForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 正则
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取文章分类列表
    async getArtList () {
      const { data: res } = await this.$http({
        method: 'get',
        url: '/my/cate/list'
      })
      this.ArtList = res.data
    },
    // 重置添加表单
    resetForm () {
      this.$refs.addRef.resetFields()
    },
    // 添加文章
    addCate () {
      this.$refs.addRef.validate(async (valid) => {
        if (!valid) return this.$message.error('添加失败!请检查输入')
        const { data: res } = await this.$http({
          method: 'post',
          url: '/my/cate/add',
          data: this.addForm
        })
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.addVisible = false
        this.getArtList()
      })
    },
    // 重置修改表单
    resetEditForm () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改,渲染当前数据到表单
    async showEditDialog (id) {
      const { data: res } = await this.$http({
        method: 'get',
        url: '/my/cate/info',
        params: { id }
      })
      this.editForm = res.data
      // 展示对话框
      this.editVisible = true
    },
    // 点击对话框确认, 修改文章分类
    editCate () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('修改失败!请检查输入')
        const { data: res } = await this.$http({
          method: 'put',
          url: '/my/cate/info',
          data: this.editForm
        })
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.editVisible = false
        this.getArtList()
      })
    },
    // 删除文章分类
    delCate (id) {
      if (id === 2213 || id === 2214 || id === 2215) { return this.$message.error('管理员不允许删除该分类!') }
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http({
            method: 'delete',
            url: '/my/cate/del',
            params: { id }
          })
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.getArtList()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
