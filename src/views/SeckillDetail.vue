<template>
  <div class="seckill-detail-container" v-if="product">
    <div class="image-section">
      <img :src="product.image" alt="商品图" />
    </div>
    <div class="info-section">
      <h2>{{ product.name }}</h2>
      <div class="price">
        <span class="seckill-price">¥{{ product.seckillPrice.toFixed(2) }}</span>
        <span class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
      </div>

      <div class="stock">库存：{{ product.availableStock }} / {{ product.totalStock }}</div>
      <div class="time">
        <div>开始时间：{{ formatTime(product.startTime) }}</div>
        <div>结束时间：{{ formatTime(product.endTime) }}</div>
        <div class="countdown" v-if="status !== '已结束'">
          <strong>{{ status }}</strong>：{{ countdown }}
        </div>
      </div>

      <div class="buttons">
        <button class="btn add-cart" :disabled="status !== '进行中'">加入购物车</button>
        <!-- <button class="btn buy-now" :disabled="status !== '进行中'">立即抢购</button> -->
     <button class="btn buy-now" :disabled="status !== '进行中'" @click="handleBuyNow">
  立即抢购
</button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)
const countdown = ref('')
const status = ref('')

let timer = null

function formatTime(time) {
  return new Date(time).toLocaleString()
}

function updateCountdown() {
  const now = new Date().getTime()
  const start = new Date(product.value.startTime).getTime()
  const end = new Date(product.value.endTime).getTime()

  if (now < start) {
    status.value = '未开始'
    countdown.value = formatRemaining(start - now)
  } else if (now >= start && now <= end) {
    status.value = '进行中'
    countdown.value = formatRemaining(end - now)
  } else {
    status.value = '已结束'
    countdown.value = ''
    clearInterval(timer)
  }
}

function formatRemaining(ms) {
  const sec = Math.floor(ms / 1000)
  const h = String(Math.floor(sec / 3600)).padStart(2, '0')
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

async function fetchDetail() {
  const id = route.params.id
  try {
    const res = await axios.get(`/api/seckill/seckill/detail/${id}`)
    if (res.data.code === 200) {
      product.value = res.data.data
      updateCountdown()
      timer = setInterval(updateCountdown, 1000)
    } else {
      console.error('接口错误:', res.data.msg)
    }
  } catch (e) {
    console.error('请求失败:', e)
  }
}

onMounted(fetchDetail)
onUnmounted(() => {
  if (timer) clearInterval(timer)
})


// 抢购逻辑
async function handleBuyNow() {
  try {
    const res = await axios.post(`/api/seckill/seckill/purchase/${product.value.id}`)
    if (res.data.code === 200) {
      alert('抢购成功！')
      // 可跳转订单确认页等
      // router.push('/order/confirm')
    } else {
      alert('抢购失败：' + res.data.msg)
    }
  } catch (err) {
    alert('请求失败，请稍后再试')
    console.error(err)
  }
}




</script>


















<style scoped>
.seckill-detail-container {
  display: flex;
  gap: 30px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.image-section img {
  width: 320px;
  height: 320px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  margin: 10px 0;
}

.seckill-price {
  color: #e53935;
  font-weight: bold;
  margin-right: 12px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
}

.stock {
  margin: 10px 0;
  font-size: 16px;
}

.time {
  margin: 12px 0;
  font-size: 16px;
  color: #666;
}

.countdown {
  margin-top: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
}

.buttons {
  margin-top: 20px;
}

.btn {
  padding: 10px 24px;
  font-size: 16px;
  margin-right: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-cart {
  background-color: #f0ad4e;
  color: white;
}

.add-cart:disabled {
  background-color: #f8d7a3;
  cursor: not-allowed;
}

.buy-now {
  background-color: #d9534f;
  color: white;
}

.buy-now:disabled {
  background-color: #eda3a0;
  cursor: not-allowed;
}
</style>
