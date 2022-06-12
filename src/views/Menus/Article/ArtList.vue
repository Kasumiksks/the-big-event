<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <!-- :inline="true"`表单在一行显示 -->
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                :label="item.cate_name"
                :value="item.id"
                v-for="item in cateList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getArticleList"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetQ">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="pubDialogVisible = true"
          >发表文章</el-button
        >
      </div>
      <!-- 文章表格区域 -->
      <el-table :data="articleList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="{ row }">
            <el-link type="primary" @click="showArticle(row.id)">{{
              row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="{ row }">
            {{ dateFormat(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" @click="deleteArticle(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 10, 20]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章对话框start -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @closed="resetForm"
    >
      <!-- 发布文章的表单 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              :label="item.cate_name"
              :value="item.id"
              v-for="item in cateList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 文章内容 -->
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFile"
            @change="chooseImg"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="$refs.iptFile.click()"
            >+ 选择封面</el-button
          >
        </el-form-item>
        <el-button type="primary" @click="pubArticle('已发布')">发布</el-button>
        <el-button type="info" @click="pubArticle('草稿')">存为草稿</el-button>
      </el-form>
    </el-dialog>
    <!-- 发表文章对话框end -->
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ articleDetails.title }}</h1>
      <div class="info">
        <span
          >作者: {{ articleDetails.nickname || articleDetails.username }}</span
        >
        <span>发布时间: {{ dateFormat(articleDetails.pub_date) }}</span>
        <span>所属分类: {{ articleDetails.cate_name }}</span>
        <span>状态: {{ articleDetails.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>

      <img
        :src="
          'http://big-event-vue-api-t.itheima.net' + articleDetails.cover_img
        "
      />
      <div v-html="articleDetails.content"></div>
    </el-dialog>
  </div>
</template>

<script>
// 导入dayjs
import dayjs from 'dayjs'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
// webpack 会将代码进行打包, 如果图片的大小大于8kb , 直接打包成一个单独的文件
// 如果小于8kb , 直接生成 base64 的字符串
export default {
  name: 'ArtList',
  created () {
    this.getCateList()
    this.getArticleList()
  },
  data () {
    return {
      // 文章详情对象
      articleDetails: {},
      // 文章详情对话框是否可见
      detailVisible: false,
      // 文章分类列表
      cateList: [],
      // 文章列表
      articleList: [],
      // 保存文章的总数
      total: 0,
      // 查询参数对象
      q: {
        pagenum: 1, // 当前页码数
        pagesize: 10, // 每一页显示的条数
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
      },
      pubDialogVisible: false,
      // 表单的数据对象
      pubForm: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: null,
        state: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 在对话框将要关闭时，询问用户是否确认关闭对话框
    // 关闭事件的处理函数
    handleClose (done) {
      this.$confirm('关闭后已编辑的内容将不会保存, 确认退出吗?', '提示', {
        confirmButtonText: '确认退出',
        cancelButtonText: '我再想想'
      })
        .then(() => {
          // 清空表单
          this.$refs.pubFormRef.resetFields()
          // 调用函数关闭对话框
          done(true)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 请求文章分类列表
    async getCateList () {
      const { data: res } = await this.$http({
        method: 'get',
        url: '/my/cate/list'
      })
      if (res.code !== 0) return
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 上传图片
    chooseImg (e) {
      const file = e.target.files
      if (file.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        // 设置默认图片的地址
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 用户选择了封面
        // 获取上传的图片存储到组件的data函数中
        this.pubForm.cover_img = file[0]
        // 获取到文件对象file[0]
        // createObjectURL会将文件对象存储到内容中, 返回一个可以访问的地址
        const url = URL.createObjectURL(file[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
    },
    // 重置表单
    resetForm () {
      // resetFields只能重置带有prop属性的
      this.$refs.pubFormRef.resetFields()
      this.pubForm.cover_img = null
      this.pubForm.state = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 发布文章
    pubArticle (state) {
      // 1. 设置发布状态
      this.pubForm.state = state
      // 2.表单校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('发布失败!请完善文章信息！')
        if (this.pubForm.cover_img === null) {
          return this.$message.error('请选择文章封面！')
        }
        // 3. 将 pubForm 转换为 FormData 格式
        const fd = new FormData()
        Object.keys(this.pubForm).forEach((item) => {
          fd.append(item, this.pubForm[item])
        })
        // 4. 发送请求
        const { data: res } = await this.$http({
          method: 'post',
          url: '/my/article/add',
          data: fd
        })
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 5. 关闭对话框
        this.pubDialogVisible = false
        // 6. 更新文章列表
        this.getArticleList()
      })
    },
    // 获取文章列表
    async getArticleList () {
      const { data: res } = await this.$http({
        method: 'get',
        url: '/my/article/list',
        params: this.q
      })
      console.log(res)
      if (res.code !== 0) return this.$message.error('获取文章列表数据失败！')
      this.articleList = res.data
      this.total = res.total
    },
    // 格式化时间
    dateFormat (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 切换每一页显示的条数时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.q.pagesize = val
      this.getArticleList()
    },
    // 切换页码时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.q.pagenum = val
      this.getArticleList()
    },
    // 重置筛选条件
    resetQ () {
      this.q = {
        pagenum: 1, // 当前页码数
        pagesize: 10, // 每一页显示的条数
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
      }
      this.getArticleList()
    },
    // 点击标题预览文章
    async showArticle (id) {
      const { data: res } = await this.$http({
        method: 'get',
        url: '/my/article/info',
        params: { id }
      })
      if (res.code !== 0) return this.$message.error(res.message)
      this.articleDetails = res.data
      this.detailVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// /deep/ 样式穿透
/deep/ .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>
