<template>
  <div class="container">
    <!-- 购物车图标 -->
    <div class="cart-icon-wrapper" @click="goToCart" title="购物车">
      <svg class="cart-icon" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM7.218 12h8.063c.546 0 1.048-.343 1.236-.852l3.163-7.808-1.785-.723-3.117 7.693H7.217L5 4H2v2h2l3.6 7.59-1.35 2.44C5.17 16.49 5 16.75 5 17c0 1.104.896 2 2 2h12v-2H7.218z"
        />
      </svg>
      <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
    </div>

    <!-- 商品详情卡片 -->
    <div class="product-card" v-if="product">
      <button class="btn-back" @click="goBack">← 返回</button>

      <div class="content-wrapper">
        <div class="image-wrapper">
          <img
            :src="product.image || defaultImage"
            alt="商品图片"
            @error="onImageError"
            class="product-image"
          />
          <span v-if="isSeckill" class="badge-seckill">秒杀</span>
        </div>

        <div class="info-wrapper">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-brand">品牌：{{ product.brand || "未知品牌" }}</p>
          <p class="product-desc">{{ product.description || "暂无介绍" }}</p>
          <p class="product-sales">销量：{{ product.salesVolume ?? "未知" }}</p>

          <div class="price-wrapper">
            <div class="original-price" v-if="isSeckill">
              ￥{{ product.originalPrice }}
            </div>
            <div class="final-price">
              ￥
              <strong>{{ isSeckill ? product.seckillPrice : product.price }}</strong>
            </div>
          </div>

          <div class="button-group">
            <button class="btn-primary" @click="isSeckill ? seckillBuy() : buyNow()">
              {{ isSeckill ? "立即秒杀" : "立即购买" }}
            </button>
            <button
            
              class="btn-secondary"
              @click="addToCart"
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">加载中...</div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const product = ref(null)
const isSeckill = ref(false)
const defaultImage = 'https://via.placeholder.com/400x300?text=无图'

const cartCount = ref(0)

const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user && user.id ? user : null
  } catch {
    return null
  }
}

const fetchProductDetail = async () => {
  try {
    isSeckill.value = route.query.seckill === 'true'
    const url = isSeckill.value
      ? `/api/seckill/seckill/detail/${productId}`
      : `/api/product/product/${productId}`
    const res = await axios.get(url)
    if (res.data.code === 200 || res.data.data) {
      product.value = res.data.data || res.data
    } else {
      console.error('获取商品详情失败:', res.data.msg)
    }
  } catch (e) {
    console.error('加载商品失败', e)
  }
}

const fetchCartCount = async () => {
  const user = getUser()
  if (!user) {
    cartCount.value = 0
    return
  }
  try {
    const res = await axios.get(`/api/cart/count?userId=${user.id}`)
    if (res.data.code === 200) {
      cartCount.value = res.data.data
    }
  } catch (e) {
    console.error('获取购物车数量失败', e)
  }
}

const addToCart = async () => {
  const user = getUser()
  if (!user) {
    alert('请先登录')
    router.push('/login')
    return
  }
  try {
    const res = await axios.post('/api/cart/add', {
      userId: user.id,
      productId: product.value.id,
      quantity: 1,
    })
    if (res.data.code === 200) {
      cartCount.value += 1
      alert('已加入购物车')
    } else {
      alert(res.data.msg || '加入购物车失败')
    }
  } catch (e) {
    console.error('加入购物车出错', e)
    alert('加入购物车失败')
  }
}

const buyNow = () => {
  if (!getUser()) {
    alert('请先登录')
    router.push('/login')
    return
  }
  alert(`立即购买：商品 ID ${product.value.id}`)
  // TODO: 跳转到购买流程页面
}

const seckillBuy = () => {
  if (!getUser()) {
    alert('请先登录')
    router.push('/login')
    return
  }
  alert(`立即秒杀：商品 ID ${product.value.id}`)
  // TODO: 跳转秒杀下单页面
}

const goBack = () => {
  router.back()
}

const onImageError = (e) => {
  e.target.src = defaultImage
}

const goToCart = () => {
  router.push('/cart')
}

onMounted(async () => {
  await fetchProductDetail()
  await fetchCartCount()
})
</script>


<style scoped>


/* 容器 */
.container {
  max-width: 720px;
  margin: 24px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  position: relative;
  padding: 0 16px;
}

/* 购物车图标 */
.cart-icon-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 42px;
  height: 42px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: #555;
  transition: color 0.3s ease;
}
.cart-icon-wrapper:hover {
  color: #007aff;
}
.cart-icon {
  width: 24px;
  height: 24px;
}
.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff3b30;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: 600;
}

/* 商品卡片 */
.product-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgb(0 0 0 / 0.1);
  overflow: hidden;
  padding: 24px;
}

/* 返回按钮 */
.btn-back {
  background: none;
  border: none;
  font-size: 16px;
  margin-bottom: 20px;
  color: #666;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s;
}
.btn-back:hover {
  color: #007aff;
}

/* 内容区：左右布局 */
.content-wrapper {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

/* 图片部分 */
.image-wrapper {
  position: relative;
  flex: 1 1 280px;
  max-width: 280px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.08);
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* 秒杀徽章 */
.badge-seckill {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #ff453a;
  color: white;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
  user-select: none;
  box-shadow: 0 0 8px #ff453aaa;
}

/* 信息部分 */
.info-wrapper {
  flex: 1 1 360px;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 700;
  font-size: 24px;
  margin: 0 0 12px 0;
  line-height: 1.3;
  color: #222;
}

.product-brand,
.product-desc,
.product-sales {
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
  line-height: 1.5;
}

/* 价格区 */
.price-wrapper {
  margin: 20px 0;
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.original-price {
  font-size: 18px;
  text-decoration: line-through;
  color: #999;
}

.final-price {
  font-size: 28px;
  font-weight: 800;
  color: #ff453a;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 14px 0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn-primary {
  background: linear-gradient(90deg, #007aff, #0051a8);
  color: white;
}
.btn-primary:hover {
  background: linear-gradient(90deg, #0051a8, #003d7a);
}

.btn-secondary {
  background: #e1e4e8;
  color: #444;
}
.btn-secondary:hover {
  background: #cfd3d8;
}

/* 加载中 */
.loading {
  text-align: center;
  font-size: 20px;
  padding: 80px 0;
  color: #777;
}

/* 响应式 */
@media (max-width: 680px) {
  .content-wrapper {
    flex-direction: column;
  }

  .image-wrapper,
  .info-wrapper {
    max-width: 100%;
  }
}

</style>