<template>
  <div class="home">
    <!-- 顶部字段行 -->
    <!-- 顶部字段行 -->
    <div class="top-fields">
      <div class="left-link">
        <router-link to="/profile">个人主页</router-link>
      </div>
      <div class="right-links">
        <router-link to="/cart">🛒 购物车</router-link>
        <span class="divider">|</span>
        <router-link to="/orders">📦 我的订单</router-link>
        <span class="divider">|</span>
        <router-link to="/guagua">🐸 我的呱呱</router-link>
        <span class="divider">|</span>
        <router-link to="/merchant">🧰 商家服务</router-link>
      </div>
    </div>
    <div class="search-bar">
      <div class="logo">
        <img :src="logoImg" alt="logo" />
        <span class="logo-text">呱呱</span>
      </div>
      <div class="search-input-group">
         <input
      v-model="keyword"
      placeholder="请输入商品关键词"
      @keyup.enter="doSearch"
    />
    <button @click="doSearch">搜索</button>
      </div>

      <div class="search-right">
        <button class="cart-btn" @click="goToCart" title="购物车">
          🛒 购物车
          <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>

        </button>

      </div>
    </div>


    <!-- 三分栏布局：左-分类，中-秒杀/国补，右-个人模块 -->
    <div class="main-section">

      <!-- <div class="left-categories">
        <div v-for="(children, parentId) in groupedCategories" :key="parentId" class="category-row">
          <div class="category-item" v-for="cat in children" :key="cat.id">
            {{ cat.name }}
          </div>
        </div>
      </div> -->
      <div class="left-categories">
        <div v-for="(children, parentId) in groupedCategories" :key="parentId" class="category-row">
          <div class="category-item" v-for="cat in children" :key="cat.id" @click="goToCategory(cat.id)"
            style="cursor: pointer">
            {{ cat.name }}
          </div>
        </div>
      </div>


      <!-- 中间田字格 -->
      <div class="center-banner">
        <!-- 秒杀专区 -->
        <div class="grid-module seckill-section" @click="goToSeckill">
          <!-- 标题行 -->
          <div class="seckill-header">
            <h2>🔥 秒杀专区</h2>
            <p class="seckill-subtitle">限时秒杀 不容错过</p>
          </div>

          <!-- 商品展示行 -->
          <div class="seckill-products">
            <div class="seckill-item" v-for="item in hotSeckillProducts" :key="item.id">
              <img :src="item.image" alt="商品图" class="seckill-img" />
              <div class="seckill-name">{{ item.name }}</div>
              <div class="seckill-price">
                <span class="original-price">￥{{ item.originalPrice }}</span>
                <span class="seckill-now">￥{{ item.seckillPrice }}</span>
              </div>
            </div>
          </div>


        </div>


        <div class="grid-module">🛒 国补促销</div>
        <div class="grid-module">✨ 新品推荐</div>
        <div class="grid-module">💰 9.9 包邮</div>
      </div>

      <!-- 右侧用户 -->
      <div class="right-user">
        <div class="user-card">
          <div class="user-header">
            <img class="avatar" :src="user.avatar || defaultAvatar" alt="头像" />
            <div class="user-info">
              <div class="user-name">你好，{{ user.nickname || user.username || '用户' }}</div>
              <div class="user-actions">
                <button class="btn secondary" @click="switchAccount">切换账号</button>
                <button class="btn danger" @click="logout">退出</button>
              </div>
            </div>
          </div>

          <div class="user-quick-actions">
            <div class="action-item">待付款</div>
            <div class="action-item">待收货</div>
            <div class="action-item">待评价</div>
            <div class="action-item">售后</div>
            <div class="action-item">浏览记录</div>
            <div class="action-item">商品收藏</div>
            <div class="action-item">关注店铺</div>
          </div>
        </div>
      </div>



    </div>




    <div class="recommend-section">
      <router-link v-for="item in products" :key="item.id" :to="`/product/${item.id}`" class="product-card-link">
        <div class="product-card">
          <img :src="item.image" alt="商品图片" class="product-image" />

          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-brand">品牌：{{ item.brand || '未知品牌' }}</div>
            <div class="product-desc">{{ item.description || '暂无商品介绍' }}</div>
            <div class="product-sales">销量：{{ item.salesVolume ?? '未知' }}</div>
            <div class="product-price">￥{{ item.price }}</div>
          </div>
        </div>
      </router-link>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="finished" class="finished">已加载全部商品</div>
      <div ref="loadMoreRef" class="load-trigger"></div>
    </div>



  </div>
</template>

<script setup>


import '../assets/product.css'
// import { ref, onMounted } from 'vue';
import { ref, onMounted } from 'vue'
import logoImg from '../assets/guagua.jpg'; // 请将 logo.png 替换成你的实际图片路径

import { useRouter } from 'vue-router'

const router = useRouter()




const keyword = ref('')

const doSearch = () => {
  if (!keyword.value.trim()) return
  router.push({
    path: '/search',
    query: { keyword: keyword.value }
  })
}

// 左侧商品种类
// import { ref, onMounted } from 'vue'
import axios from 'axios'


//购物车

const cartCount = ref(0)

const fetchCartCount = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user || !user.id) return

  const res = await axios.get(`/api/cart/count?userId=${user.id}`)
  if (res.data.code === 200) {
    cartCount.value = res.data.data
  }
}

onMounted(() => {
  fetchCartCount()
})

const goToCart = () => {
  router.push('/cart')  // 这里改成你购物车页面的路由路径
}


const groupedCategories = ref({})

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/category/category/getList')
    const raw = res.data.data

    // 分组：以 parent_id 为 key 分组
    const grouped = {}
    raw.forEach(item => {
      if (!grouped[item.parentId]) {
        grouped[item.parentId] = []
      }
      grouped[item.parentId].push(item)
    })
    console.log(grouped)
    groupedCategories.value = grouped
  } catch (error) {
    console.error('获取分类失败：', error)
  }
}

onMounted(fetchCategories)

//点击分类跳转页面展示所有属于该分类的商品


const goToCategory = (categoryId) => {
  router.push({ path: '/category/products', query: { id: categoryId } })
}


const user = ref({})
const defaultAvatar = 'https://i.pravatar.cc/100?img=3'

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const switchAccount = () => {
  alert("没实现呢宝贝")
  // // 切换账号逻辑
  // localStorage.removeItem('token')
  // localStorage.removeItem('user')
  // location.href = '/login'
}

const logout = () => {
  // 退出登录逻辑
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  location.href = '/login'
}







// 无限下拉加载推荐商品

const products = ref([])
const pageNum = ref(1)
const pageSize = 10
const loading = ref(false)
const finished = ref(false)
const loadMoreRef = ref(null)

const listProduct = async (params) => {
  const res = await axios.get('/api/product/product/recommend', { params })

  // 控制台打印看结构
  // console.log('商品接口返回：', res.data.data)

  return res.data.data
}



const loadProducts = async () => {
  if (loading.value || finished.value) return
  loading.value = true

  try {
    const res = await listProduct({ pageNum: pageNum.value, pageSize })

    const list = res.list || []

    if (list.length > 0) {
      products.value.push(...list)
      pageNum.value += 1
    }

    // 根据 hasNextPage 判断是否加载完
    if (!res.hasNextPage || list.length < pageSize) {
      finished.value = true
    }

  } catch (err) {
    console.error('加载商品失败：', err)
  } finally {
    loading.value = false
  }
}






// 使用 IntersectionObserver 监听滚动到底部
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadProducts()
    }
  }, {
    threshold: 1.0,
  })

  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }

  loadProducts()
})



const hotSeckillProducts = ref([])

async function fetchHotSeckillProducts() {
  try {
    // 假设后台接口地址，比如 /api/seckill-products/hot
    const res = await axios.get('/api/seckill/seckill/hot')
    // 返回的数据结构假设是数组，直接赋值
    hotSeckillProducts.value = res.data
  } catch (error) {
    console.error('获取秒杀热门商品失败:', error)
  }
}

// 页面加载时调用
onMounted(() => {
  fetchHotSeckillProducts()
})








function goToSeckill() {
  router.push('/seckill')
}

</script>

<style scoped></style>
