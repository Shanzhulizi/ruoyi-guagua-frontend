<template>
  <div class="product-list">
    <h2>搜索结果：{{ keyword }}</h2>

    <div v-if="loading">加载中...</div>
    <div v-else-if="products.length === 0">没有找到商品</div>
    <div v-else class="grid">
      <div class="product-item" v-for="item in products" :key="item.id">
        <img :src="item.image || '/default.jpg'" alt="商品图" />
        <h3>{{ item.name }}</h3>
        <p>{{ item.describe }}</p>
        <p>￥{{ item.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const keyword = ref(route.query.keyword || '')
const products = ref([])
const loading = ref(true)

const fetchProducts = async () => {
  try {
    const res = await axios.post('/api/es/product/search', {
      params: { keyword: keyword.value }
    })
    products.value = res.data.data
  } catch (err) {
    console.error('搜索失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.product-item {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: center;
}
</style>
