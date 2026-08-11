<template>
  <div class="page card p-4 shadow-sm">
    <h4 class="text-center mb-3">Đăng Ký</h4>
    <form @submit.prevent="handleRegister">
      <div class="form-group mb-3">
        <label>Họ và tên</label>
        <input type="text" v-model="name" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label>Email</label>
        <input type="email" v-model="email" class="form-control" required />
      </div>
      <div class="form-group mb-3">
        <label>Mật khẩu</label>
        <input type="password" v-model="password" class="form-control" required />
      </div>
      <button class="btn btn-primary btn-block w-100">Đăng ký</button>
    </form>
    <p class="mt-3 text-center">
      Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async handleRegister() {
      try {
        await axios.post('/api/users/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        alert('Đăng ký thành công! Hãy đăng nhập.')
        this.$router.push({ name: 'login' })
      } catch (err) {
        alert(err.response?.data?.message || 'Đăng ký thất bại!')
      }
    },
  },
}
</script>
