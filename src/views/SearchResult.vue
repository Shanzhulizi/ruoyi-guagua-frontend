<template>
    <div class="product-list container">
        <h2>搜索结果：{{ keyword }}</h2>

        <!-- 搜索框和按钮 -->
        <div class="search-bar">
            <input v-model="inputKeyword" @keyup.enter="doSearch" placeholder="请输入关键词搜索" class="search-input" />
            <button @click="doSearch" class="btn btn-primary">搜索</button>
            <button @click="goBack" class="btn btn-secondary">返回</button>
        </div>

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="products.length === 0" class="no-result">没有找到商品</div>
        <div v-else class="grid">
            <div class="product-item" v-for="item in products" :key="item.id">
                <img :src="item.image || '/default.jpg'" alt="商品图" class="product-img" />
                <h3 class="product-name">{{ item.name }}</h3>
                <p class="product-desc">{{ item.describe }}</p>
                <p class="product-price">￥{{ item.price }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const keyword = ref(route.query.keyword || '')
const inputKeyword = ref(keyword.value)
const products = ref([])
const loading = ref(false)

const fetchProducts = async () => {
  if (!keyword.value) {
    products.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    // 1. 调用 ES 搜索接口
    const esRes = await axios.post('/api/es/product/search', {
      keyword: keyword.value
    })
    const esProducts = esRes.data.data || []

    if (esProducts.length === 0) {
      products.value = []
      loading.value = false
      return
    }

    // 2. 提取 id 列表
    const ids = esProducts.map(p => p.id)
    // alert(ids)
    // 3. 请求数据库接口，查询图片
    const dbRes = await axios.post('/api/es/product/batchGetByIds',  ids )
    const dbProducts = dbRes.data.data || []
    
    // 4. 合并结果（只要 ES 字段 + 数据库 image）
    products.value = esProducts.map(esP => {
      const dbP = dbProducts.find(db => db.id === esP.id)
      return {
        ...esP,
        image: dbP?.image || '/default.jpg'
      }
    })


  } catch (err) {
    console.error('搜索失败', err)
    products.value = []
  } finally {
    loading.value = false
  }
}


watch(() => route.query.keyword, (newVal) => {
    keyword.value = newVal || ''
    inputKeyword.value = keyword.value
    fetchProducts()
})

const doSearch = () => {
    if (!inputKeyword.value.trim()) {
        return
    }
    router.push({ path: '/search', query: { keyword: inputKeyword.value.trim() } })
}

const goBack = () => {
    router.back()
}

onMounted(() => {
    fetchProducts()
})
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 15px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.search-input {
    flex: 1;
    padding: 10px 15px;
    font-size: 16px;
    border: 2px solid #1890ff;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.3s ease;
}

.search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 8px rgba(24, 144, 255, 0.3);
}

.btn {
    padding: 10px 18px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    user-select: none;
}

.btn-primary {
    background-color: #1890ff;
    color: #fff;
}

.btn-primary:hover {
    background-color: #40a9ff;
}

.btn-secondary {
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
}

.loading,
.no-result {
    font-size: 18px;
    text-align: center;
    margin-top: 30px;
    color: #999;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
}

.product-item {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    background: #fff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
    transition: box-shadow 0.3s ease;
}

.product-item:hover {
    box-shadow: 0 6px 16px rgb(24 144 255 / 0.2);
}

.product-img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    margin-bottom: 12px;
}

.product-name {
    font-weight: 600;
    font-size: 18px;
    color: #1890ff;
    margin-bottom: 8px;
    min-height: 48px;
    /* 2 lines */
}

.product-desc {
    font-size: 14px;
    color: #666;
    height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 12px;
}

.product-price {
    font-weight: 700;
    font-size: 20px;
    color: #fa541c;
}
</style>
