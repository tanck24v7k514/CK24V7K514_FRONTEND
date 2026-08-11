<template>
  <div class="page card p-4 shadow-sm">
    <h4 class="text-center mb-3">Đăng Nhập</h4>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" class="form-control" required />
      </div>
      <div class="form-group">
        <label>Mật khẩu</label>
        <input type="password" v-model="password" class="form-control" required />
      </div>
      <button class="btn btn-primary btn-block">Đăng nhập</button>
    </form>

    <hr />
    <div id="googleBtn" class="d-flex justify-content-center"></div>

    <p class="mt-3 text-center">
      Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return { email: '', password: '' }
  },
  mounted() {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: '403845098077-gfu5stc521au7nf83kaah20b6bbsjgol.apps.googleusercontent.com',
        callback: this.handleGoogleResponse,
      })
      google.accounts.id.renderButton(document.getElementById('googleBtn'), {
        theme: 'outline',
        size: 'large',
      })
    }
  },
  methods: {
    async handleLogin() {
      try {
        const res = await axios.post('/api/users/login', {
          email: this.email,
          password: this.password,
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        this.$router.push({ name: 'contactbook' })
      } catch (err) {
        alert(err.response?.data?.message || 'Đăng nhập thất bại!')
      }
    },
    async handleGoogleResponse(response) {
      try {
        const res = await axios.post('/api/users/google-login', {
          idToken: response.credential,
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        this.$router.push({ name: 'contactbook' })
      } catch (err) {
        alert('Đăng nhập Google thất bại')
      }
    },
  },
}
</script>
