<template>
    <div class="product-detail" v-if="product">
        <button class="back-btn" @click="goBack">← 返回</button>

        <div class="product-container">
            <img :src="product.image || defaultImage" class="product-image" @error="onImageError" />

            <div class="product-info">
                <h1 class="product-name">{{ product.name }}</h1>
                <p class="product-brand">品牌：{{ product.brand || '未知品牌' }}</p>
                <p class="product-desc">介绍：{{ product.description || '暂无介绍' }}</p>
                <p class="product-sales">销量：{{ product.salesVolume ?? '未知' }}</p>
                <p class="product-price">价格：￥{{ product.price }}</p>

                <div class="btn-group">
                    <button class="buy-btn" @click="buyNow">立即购买</button>
                    <button class="cart-btn" @click="addToCart">加入购物车</button>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="loading">加载中...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const product = ref(null)
const defaultImage = 'https://via.placeholder.com/400x300?text=无图'

const fetchProductDetail = async () => {
    try {
        const res = await axios.get(`/api/product/product/${productId}`)
        product.value = res.data.data
    } catch (e) {
        console.error('加载商品失败', e)
    }
}

const goBack = () => {
    router.back()
}

const onImageError = (e) => {
    e.target.src = defaultImage
}


const addToCart = async () => {
  try {
    const res = await axios.post('/api/cart/add', {
      productId: product.value.id,
      quantity: 1
    })
    if (res.data.code === 200) {
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
  // 示例：跳转到结算页或提交立即购买逻辑
  alert(`立即购买：商品 ID ${product.value.id}，后续可跳转结算页`)
  // router.push(`/order/checkout?productId=${product.value.id}&quantity=1`)
}



onMounted(fetchProductDetail)
</script>

<style scoped>
.product-detail {
    padding: 20px;
}

.back-btn {
    margin-bottom: 20px;
    padding: 6px 12px;
    background-color: #eee;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.product-container {
    display: flex;
    gap: 30px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.product-image {
    width: 400px;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 16px;
}

.product-name {
    font-size: 24px;
    font-weight: bold;
}

.product-price {
    color: #e33;
    font-weight: bold;
    font-size: 20px;
}

.buy-btn {
    margin-top: 20px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.buy-btn:hover {
    background-color: #ff7875;
}

.loading {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
    color: #666;
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.buy-btn,
.cart-btn {
  padding: 10px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.buy-btn {
  background-color: #ff4d4f;
  color: white;
}

.cart-btn {
  background-color: #1890ff;
  color: white;
}

.cart-btn:hover {
  background-color: #40a9ff;
}

</style>
