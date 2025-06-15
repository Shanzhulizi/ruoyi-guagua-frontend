<template>
  <div class="product-list-container">
    <h2 class="title">分类 {{ categoryId }} 的商品</h2>
   <button @click="goHome" class="btn-home">返回主页</button>
    <ul class="product-list">
      <li v-for="product in productList" :key="product.id" class="product-card">
        <img :src="product.image" alt="商品图片" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-brand">品牌：{{ product.brand }}</p>
          <p class="product-desc" :title="product.description">{{ product.description }}</p>
          <div class="product-meta">
            <span class="price">￥{{ product.price.toFixed(2) }}</span>
            <span class="sales">销量：{{ product.salesVolume }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import { useRouter } from 'vue-router'
const route = useRoute()
const categoryId = ref(route.query.id || '')

const router = useRouter()
const productList = ref([])

const fetchProducts = async () => {
  try {
    const res = await axios.get('/api/product/product/listByCategory', {
      params: { categoryId: categoryId.value }
    })
    productList.value = res.data.data || []
  } catch (error) {
    console.error('获取商品列表失败', error)
  }
}

onMounted(fetchProducts)

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped>
.product-list-container {
  max-width: 960px;
  margin: 20px auto;
  padding: 0 16px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0;
  list-style: none;
}

.product-card {
  display: flex;
  flex-direction: column;
  width: 220px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.2);
}

.product-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background-color: #f5f5f5;
}

.product-info {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #222;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-brand {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}

.product-desc {
  font-size: 13px;
  color: #555;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 显示3行 */
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.price {
  color: #e94e1b;
  font-size: 16px;
}

.sales {
  font-size: 13px;
  color: #888;
}


.btn-home {
  margin-bottom: 20px;
  padding: 8px 16px;
  font-size: 14px;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-home:hover {
  background-color: #66b1ff;
}
</style>
