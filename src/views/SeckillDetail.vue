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
        开始时间：{{ formatTime(product.startTime) }}<br />
        结束时间：{{ formatTime(product.endTime) }}
      </div>

      <div class="buttons">
        <button class="btn add-cart">加入购物车</button>
        <button class="btn buy-now">立即抢购</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)

async function fetchDetail() {
  const id = route.params.id
  try {
    const res = await axios.get(`/api/seckill/seckill/detail/${id}`)
    if (res.data.code === 200) {
      product.value = res.data.data
    } else {
      console.error('接口错误:', res.data.msg)
    }
  } catch (e) {
    console.error('请求失败:', e)
  }
}

function formatTime(time) {
  return new Date(time).toLocaleString()
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.seckill-detail-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.image-section img {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  object-fit: cover;
}

.info-section {
  flex: 1;
}

.price {
  font-size: 20px;
  margin: 10px 0;
}

.seckill-price {
  color: red;
  font-weight: bold;
  margin-right: 10px;
}

.original-price {
  text-decoration: line-through;
  color: #888;
}

.stock {
  margin: 10px 0;
}

.time {
  margin: 10px 0;
  color: #666;
}

.buttons {
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-cart {
  background-color: #f0ad4e;
  color: white;
}

.buy-now {
  background-color: #d9534f;
  color: white;
}
</style>
