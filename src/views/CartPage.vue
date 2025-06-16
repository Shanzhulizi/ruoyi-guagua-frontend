<template>
    <div class="cart-page">
         <button class="back-btn" @click="goBack">← 返回</button>

        <h2>购物车</h2>

        <div v-if="loading">加载中...</div>
        <div v-else>
            <div v-if="cartItems.length === 0">购物车空空如也，赶快去选购吧！</div>

            <table v-else class="cart-table">
                <thead>
                    <tr>
                        <th>商品图片</th>
                        <th>商品名</th>
                        <th>描述</th>
                        <th>单价</th>
                        <th>数量</th>
                        <th>小计</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cartItems" :key="item.productId">
                        <td>
                            <img :src="item.image" alt="商品图片" class="product-image" />
                        </td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.description }}</td>
                        <td>￥{{ item.price.toFixed(2) }}</td>
                        <td>
                            <button @click="changeQuantity(item, item.quantity - 1)"
                                :disabled="item.quantity <= 1">-</button>
                            {{ item.quantity }}
                            <button @click="changeQuantity(item, item.quantity + 1)">+</button>
                        </td>
                        <td>￥{{ (item.price * item.quantity).toFixed(2) }}</td>
                        <td>
                            <button @click="removeItem(item)">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="cart-summary" v-if="cartItems.length > 0">
                <strong>总价: ￥{{ totalPrice.toFixed(2) }}</strong>
            </div>

            <button class="buy-btn" @click="buyNow()">
                立即结算
            </button>
        </div>

    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const cartItems = ref([])
const loading = ref(false)

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userId = user?.id

// 读取购物车列表
const fetchCartItems = async () => {
    if (!userId) {
        alert('请先登录')
        return
    }
    loading.value = true
    try {
        const res = await axios.get(`/api/cart/list/${userId}`)
        if (res.data.code === 200) {
            cartItems.value = res.data.data
        } else {
            alert(res.data.msg || '获取购物车失败')
        }
    } catch (e) {
        console.error('获取购物车异常', e)
        alert('获取购物车失败')
    } finally {
        loading.value = false
    }
}

// 修改数量
const changeQuantity = async (item, newQty) => {
    if (newQty < 1) return
    try {
        const res = await axios.post('/api/cart/update', {
            userId,
            productId: item.productId,
            quantity: newQty,
        })
        if (res.data.code === 200) {
            item.quantity = newQty
        } else {
            alert(res.data.msg || '更新数量失败')
        }
    } catch (e) {
        console.error('更新数量异常', e)
        alert('更新数量失败')
    }
}

// 删除商品
const removeItem = async (item) => {
    try {
        const res = await axios.post('/api/cart/remove', {
            userId,
            productId: item.productId,
        })
        if (res.data.code === 200) {
            cartItems.value = cartItems.value.filter(ci => ci.productId !== item.productId)
        } else {
            alert(res.data.msg || '删除失败')
        }
    } catch (e) {
        console.error('删除异常', e)
        alert('删除失败')
    }
}

// 计算总价
const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

//结算购物车
const buyNow = () => {
    alert(`买！全都买`)
}

import { useRouter } from 'vue-router'
// 先创建路由实例
const router = useRouter()

const goBack = () => {
  router.back()
}


onMounted(() => {
    fetchCartItems()
})


</script>

<style scoped>


.cart-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: "Helvetica Neue", Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.back-btn {
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
}

.back-btn:hover {
  text-decoration: underline;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cart-table th,
.cart-table td {
  border: 1px solid #eee;
  padding: 12px;
  text-align: center;
  vertical-align: middle;
}

.cart-table th {
  background-color: #f8f9fa;
  color: #555;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
  font-size: 1.2em;
  color: #333;
  font-weight: bold;
}

.buy-btn {
  display: block;
  margin: 30px auto 0;
  padding: 10px 30px;
  background-color: #28a745;
  font-size: 16px;
}

.buy-btn:hover {
  background-color: #218838;
}


</style>
