<template>
    <div class="cart-icon-wrapper" @click="goToCart">
        🛒
        <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
    </div>


    <div class="product-detail" v-if="product">
        <button class="back-btn" @click="goBack">← 返回</button>

        <div class="product-container">
            <img :src="product.image || defaultImage" class="product-image" @error="onImageError" />

            <div class="product-info">
                <!-- 秒杀横幅 -->
                <div v-if="product.isSeckill" class="seckill-banner">
                    🐸 呱呱秒杀进行中！限时优惠，不容错过！
                </div>

                <h1 class="product-name">{{ product.name }}</h1>
                <p class="product-brand">品牌：{{ product.brand || '未知品牌' }}</p>
                <p class="product-desc">介绍：{{ product.description || '暂无介绍' }}</p>
                <p class="product-sales">销量：{{ product.salesVolume ?? '未知' }}</p>

                <!-- 秒杀价展示 -->
                <p class="product-price">
                    <template v-if="product.isSeckill">
                        原价：<del>￥{{ product.originalPrice }}</del><br>
                        秒杀价：<strong class="seckill-price">￥{{ product.seckillPrice }}</strong>
                    </template>
                    <template v-else>
                        价格：￥{{ product.price }}
                    </template>
                </p>

                <div class="btn-group">
                    <button class="buy-btn" @click="product.isSeckill ? seckillBuy() : buyNow()">
                        {{ product.isSeckill ? '立即秒杀' : '立即购买' }}
                    </button>
                    <button class="cart-btn" v-if="!product.isSeckill" @click="addToCart">
                        加入购物车
                    </button>
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
        const user = JSON.parse(localStorage.getItem('user'))
        // alert(user.id)
        if (!user || !user.id) {
            alert('请先登录')
            return
        }


        const res = await axios.post('/api/cart/add', {
            userId: user.id,               // 从本地存储中获取 userId
            productId: product.value.id,
            quantity: 1
        })

        if (res.data.code === 200) {
            //   alert('已加入购物车')
            cartCount.value += 1
        } else {
            alert(res.data.msg || '加入购物车失败')
        }
    } catch (e) {
        console.error('加入购物车出错', e)
        alert('加入购物车失败')
    }
}


const buyNow = () => {
    alert(`立即购买：商品 ID ${product.value.id}`)
}

const seckillBuy = () => {
    alert(`立即秒杀：商品 ID ${product.value.id}`)
    // 可跳转秒杀下单页面，如：router.push(`/seckill/checkout/${product.value.id}`)
}

onMounted(fetchProductDetail)




/////////////////////////////////////////////////
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
    fetchProductDetail()
    fetchCartCount()
})


const goToCart = () => {
    router.push('/cart') // 假设你有这个路由页面
}

</script>

<style scoped>
.seckill-banner {
    background-color: #ffefcc;
    color: #d35400;
    font-weight: bold;
    padding: 8px 12px;
    border: 2px dashed #d35400;
    border-radius: 8px;
    margin-bottom: 12px;
    text-align: center;
}

.seckill-price {
    color: red;
    font-size: 20px;
    font-weight: bold;
}
</style>


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












/* ******************************************** */
.cart-icon-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 40px;     /* 整个容器宽度 */
  height: 40px;    /* 高度 */
  display: inline-block;
  font-size: 32px; /* 图标大小 */
}

.cart-icon {
  width: 100%;
  height: 100%;
  display: block;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px 9px;
  font-size: 16px;
  font-weight: bold;
  min-width: 26px;
  text-align: center;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}


</style>
