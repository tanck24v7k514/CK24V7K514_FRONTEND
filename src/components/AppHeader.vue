<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-between px-3">
    <div class="d-flex align-items-center">
      <router-link :to="{ name: 'contactbook' }" class="navbar-brand">
        Ứng dụng Quản lý danh bạ
      </router-link>
      <div class="navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'contactbook' }" class="nav-link">
            Danh bạ
            <i class="fas fa-address-book"></i>
          </router-link>
        </li>
      </div>
    </div>
    <div class="user-menu-container position-relative" v-if="currentUser" ref="userMenu">
      <div
        class="user-avatar d-flex align-items-center justify-content-center cursor-pointer"
        @click="toggleDropdown"
        title="Tài khoản"
      >
        <img
          v-if="currentUser.picture"
          :src="currentUser.picture"
          class="rounded-circle border border-light"
          alt="User Avatar"
          width="36"
          height="36"
        />

        <div
          v-else
          class="avatar-initials rounded-circle bg-primary text-white d-flex align-items-center justify-content-center font-weight-bold"
        >
          {{ userInitials }}
        </div>
      </div>

      <div
        v-if="showDropdown"
        class="dropdown-menu dropdown-menu-right show position-absolute mt-2 shadow-sm"
        style="right: 0; left: auto; min-width: 200px"
      >
        <div class="px-3 py-2 border-bottom">
          <div class="font-weight-bold text-truncate">{{ currentUser.name || 'Người dùng' }}</div>
          <small class="text-muted text-truncate d-block">{{ currentUser.email }}</small>
        </div>

        <button class="dropdown-item text-danger py-2 cursor-pointer" @click="handleLogout">
          <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      currentUser: null,
      showDropdown: false,
    }
  },
  computed: {
    userInitials() {
      if (!this.currentUser || !this.currentUser.name) return 'U'
      const words = this.currentUser.name.trim().split(' ')
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase()
      }
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    },
  },
  methods: {
    loadUser() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.currentUser = JSON.parse(userStr)
        } catch (e) {
          this.currentUser = null
        }
      } else {
        this.currentUser = null
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    handleLogout() {
      this.showDropdown = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.currentUser = null
      this.$router.push({ name: 'login' })
    },
    handleClickOutside(event) {
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(event.target)) {
        this.showDropdown = false
      }
    },
  },
  mounted() {
    this.loadUser()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  watch: {
    $route() {
      this.loadUser()
    },
  },
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.avatar-initials {
  width: 36px;
  height: 36px;
  font-size: 14px;
  border: 1.5px solid #fff;
  user-select: none;
}

.user-avatar:hover {
  opacity: 0.85;
}

.dropdown-menu {
  z-index: 1000;
}
</style>
