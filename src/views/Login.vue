<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">京东登录</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" v-model="username" placeholder="手机号 / 用户名 / 邮箱" class="form-input" />
        </div>

        <div class="form-group">
          <input type="password" v-model="password" placeholder="请输入密码" class="form-input" />
        </div>

        <div class="form-group captcha-group">
          <input type="text" v-model="code" placeholder="验证码" class="form-input captcha-input" />
          <img :src="'data:image/jpeg;base64,' + captchaImg" class="captcha-img" @click="getCaptcha" alt="点击刷新验证码"
            title="点击刷新验证码" />
        </div>

        <button class="login-button" type="submit">立即登录</button>
      </form>

      <div class="login-footer">
        <a href="#">忘记密码</a>
        <span>|</span>
        <a @click.prevent="goRegister" href="#">免费注册</a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 表单数据
const username = ref('')
const password = ref('')
const code = ref('')
const uuid = ref('')
const captchaImg = ref('')

// 获取验证码
const getCaptcha = async () => {
  try {
    const res = await axios.get('/api/captchaImage')
    uuid.value = res.data.uuid
    captchaImg.value = res.data.img
  } catch (error) {
    console.error('验证码获取失败', error)
  }
}

// 登录逻辑
// 登录逻辑
const handleLogin = async () => {
  if (!username.value || !password.value || !code.value) {
    alert('请填写完整信息')
    return
  }

  try {
    const res = await axios.post('/api/user/user/login', {
      username: username.value,
      password: password.value,
      code: code.value,
      uuid: uuid.value
    })

    console.log(res)
    // alert(JSON.stringify(res.data.user))
    // alert(res.data.token)
    const token = res.data.token
    const user = res.data.user
    // 保存 token 到本地（localStorage，也可以用 cookie）
    localStorage.setItem('token', 'Bearer ' + token)
    localStorage.setItem('user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

    console.log('登录成功:', res.data)
    router.push('/home')
  } catch (error) {
    const msg = error?.response?.data?.msg || '登录失败，请检查信息或验证码'
    alert(msg)
    await getCaptcha()
  }
}

// 初始化
onMounted(() => {
  getCaptcha()
})



const goRegister = () => {
  router.push('/register')
}

</script>


<style scoped>
.login-container {
  background-color: #f4f4f4;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 380px;
  background: #fff;
  padding: 40px 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #e1251b;
  outline: none;
}

.captcha-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  height: 40px;
  width: 100px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.login-button {
  width: 100%;
  background-color: #e1251b;
  color: #fff;
  padding: 12px;
  border: none;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #c91b15;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-footer a {
  color: #666;
  text-decoration: none;
}

.login-footer a:hover {
  color: #e1251b;
}
</style>
