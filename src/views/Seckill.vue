<template>
  <div class="seckill-container">
    <h2>秒杀商品</h2>
    <div class="product-grid">
      <div
        v-for="item in products"
        :key="item.id"
        class="product-card"
        @click="goToDetail(item.id)"
      >
        <img :src="item.image" alt="商品图" class="product-image" />
        <h3 class="product-name">{{ item.name }}</h3>
        <div class="price">
          <span class="seckill-price">秒杀价 ¥{{ item.seckillPrice.toFixed(2) }}</span>
          <span class="original-price">¥{{ item.originalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])

async function fetchSeckillProducts() {
  try {
    const res = await axios.get('/api/seckill/seckill/listAll') // 注意：前缀 /api
    if (res.data.code === 200) {
      products.value = res.data.data
    } else {
      console.error('接口返回错误:', res.data.msg)
    }
  } catch (error) {
    console.error('请求秒杀商品失败', error)
  }
}

function goToDetail(id) {
  router.push(`/seckill/detail/${id}`)
}

onMounted(() => {
  fetchSeckillProducts()
})
</script>

<style scoped>
.seckill-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  background-color: #fff;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  font-size: 16px;
  margin: 10px 0 6px;
  color: #333;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-size: 14px;
  color: #888;
}

.seckill-price {
  color: #e53935;
  font-weight: bold;
  margin-right: 8px;
}

.original-price {
  text-decoration: line-through;
  font-size: 13px;
  color: #aaa;
}
</style>
