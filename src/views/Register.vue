<template>
      <el-button @click="goBack">返回登录</el-button>
  <el-form :model="form" label-width="80px">
    <!-- 用户名 -->
    <el-form-item label="用户名" required>
      <el-input v-model="form.username" />
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码" required>
      <el-input type="password" v-model="form.password" show-password />
    </el-form-item>

    <!-- 昵称 -->
    <el-form-item label="昵称">
      <el-input v-model="form.nickname" />
    </el-form-item>

    <!-- 手机号 -->
    <el-form-item label="手机号">
      <el-input v-model="form.phone" />
    </el-form-item>

    <!-- 邮箱 -->
    <el-form-item label="邮箱">
      <el-input v-model="form.email" />
    </el-form-item>

    <!-- 性别 -->
    <el-form-item label="性别">
      <el-select v-model="form.gender" placeholder="请选择">
        <el-option label="未知" :value="0" />
        <el-option label="男" :value="1" />
        <el-option label="女" :value="2" />
      </el-select>
    </el-form-item>

    <!-- 上传头像 -->
    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        action="/api/common/upload"
        name="file"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="form.avatar" :src="form.avatar" class="avatar" />
        <el-icon v-else><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <!-- 注册按钮 -->
    <el-form-item>
      <el-button type="primary" @click="handleRegister">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  gender: null // 0=未知, 1=男, 2=女
})

const handleAvatarSuccess = (response) => {
  if (response.code === 200) {
    form.value.avatar = response.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.msg || '上传失败')
  }
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) ElMessage.error('只能上传 JPG/PNG 图片!')
  if (!isLt2M) ElMessage.error('图片大小不能超过 2MB!')
  return isImage && isLt2M
}

const handleRegister = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }

  try {
    await axios.post('/api/user/user/register', form.value)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (err) {
    ElMessage.error(err?.response?.data?.msg || '注册失败')
  }
}
const goBack = () => {
  router.push('/login')
}
</script>

<style scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
