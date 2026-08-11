<template>
  <div class="page row">
    <!-- Thanh tìm kiếm -->
    <div class="col-md-12 mb-3">
      <InputSearch v-model="searchText" />
    </div>

    <!-- Thanh lọc Liên hệ yêu thích -->
    <div class="col-md-12 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <button
        class="btn btn-sm mr-2 mb-1"
        :class="selectedFilter === 'ALL' ? 'btn-dark' : 'btn-outline-dark'"
        @click="selectedFilter = 'ALL'"
      >
        Tất cả
      </button>

      <button
        class="btn btn-sm mr-2 mb-1 text-white font-weight-bold"
        :class="
          selectedFilter === 'Âm nhạc'
            ? 'bg-music-custom active-filter'
            : 'bg-music-custom opacity-60'
        "
        @click="selectedFilter = 'Âm nhạc'"
      >
        Âm nhạc
      </button>

      <button
        class="btn btn-sm mr-2 mb-1 text-white font-weight-bold"
        :class="
          selectedFilter === 'Thể thao'
            ? 'bg-sports-custom active-filter'
            : 'bg-sports-custom opacity-60'
        "
        @click="selectedFilter = 'Thể thao'"
      >
        Thể thao
      </button>

      <button
        class="btn btn-sm mr-2 mb-1 text-white font-weight-bold"
        :class="
          selectedFilter === 'Du lịch'
            ? 'bg-travel-custom active-filter'
            : 'bg-travel-custom opacity-60'
        "
        @click="selectedFilter = 'Du lịch'"
      >
        Du lịch
      </button>

      <button
        class="btn btn-sm mr-2 mb-1 text-white font-weight-bold"
        :class="
          selectedFilter === 'Đọc sách'
            ? 'bg-reading-custom active-filter'
            : 'bg-reading-custom opacity-60'
        "
        @click="selectedFilter = 'Đọc sách'"
      >
        Đọc sách
      </button>
    </div>

    <!-- Cột Danh sách Liên hệ -->
    <div class="mt-2 col-md-6">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="m-0">Danh bạ <i class="fas fa-address-book"></i></h4>
        <button class="btn btn-sm btn-light border" @click="toggleSort">
          Sắp xếp: {{ sortOrder === 'asc' ? 'A-Z ▲' : 'Z-A ▼' }}
        </button>
      </div>

      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="paginatedContacts"
        v-model:activeIndex="activeIndex"
      />
      <p v-else class="text-muted mt-2">Không có liên hệ nào.</p>

      <!-- Phân trang -->
      <nav class="mt-3" v-if="totalPages > 1">
        <ul class="pagination pagination-sm justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--">Trước</button>
          </li>
          <li
            class="page-item"
            v-for="p in totalPages"
            :key="p"
            :class="{ active: currentPage === p }"
          >
            <button class="page-link" @click="currentPage = p">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++">Sau</button>
          </li>
        </ul>
      </nav>

      <!-- Hàng nút thao tác danh sách -->
      <div class="mt-3 d-flex justify-content-between align-items-center">
        <button class="btn btn-sm btn-primary flex-fill mr-1" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success flex-fill mr-1" @click="goToAddContact">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger flex-fill" @click="removeAllContacts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Cột Chi tiết Liên hệ -->
    <div class="mt-2 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="activeContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: activeContact._id },
          }"
        >
          <button class="mt-2 btn btn-sm btn-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ContactCard from '@/components/ContactCard.vue'
import InputSearch from '@/components/InputSearch.vue'
import ContactList from '@/components/ContactList.vue'
import ContactService from '@/services/contact.service'

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },
  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: '',
      selectedFilter: 'ALL',
      currentPage: 1,
      pageSize: 5,
      sortOrder: 'asc',
    }
  },
  watch: {
    searchText() {
      this.resetSelection()
    },
    selectedFilter() {
      this.resetSelection()
    },
    sortOrder() {
      this.resetSelection()
    },
  },
  computed: {
    filteredContacts() {
      let list = this.contacts
      if (this.selectedFilter !== 'ALL') {
        list = list.filter(
          (contact) =>
            Array.isArray(contact.favorite) && contact.favorite.includes(this.selectedFilter),
        )
      }
      if (this.searchText) {
        const search = this.searchText.toLowerCase().trim()
        list = list.filter((contact) => {
          const name = (contact.name || '').toLowerCase()
          const email = (contact.email || '').toLowerCase()
          const address = (contact.address || '').toLowerCase()
          const phone = (contact.phone || '').toLowerCase()
          return (
            name.includes(search) ||
            email.includes(search) ||
            address.includes(search) ||
            phone.includes(search)
          )
        })
      }
      return list
    },
    sortedContacts() {
      return [...this.filteredContacts].sort((a, b) => {
        const nameA = (a.name || '').toUpperCase()
        const nameB = (b.name || '').toUpperCase()
        if (this.sortOrder === 'asc') return nameA.localeCompare(nameB)
        return nameB.localeCompare(nameA)
      })
    },
    totalPages() {
      return Math.ceil(this.sortedContacts.length / this.pageSize) || 1
    },
    paginatedContacts() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.sortedContacts.slice(start, start + this.pageSize)
    },
    activeContact() {
      if (this.activeIndex < 0 || !this.paginatedContacts[this.activeIndex]) return null
      return this.paginatedContacts[this.activeIndex]
    },
    filteredContactsCount() {
      return this.filteredContacts.length
    },
  },
  methods: {
    resetSelection() {
      this.activeIndex = -1
      this.currentPage = 1
    },
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll()
      } catch (error) {
        console.log(error)
      }
    },
    refreshList() {
      this.retrieveContacts()
      this.resetSelection()
    },
    async removeAllContacts() {
      if (confirm('Bạn muốn xóa tất cả Liên hệ?')) {
        try {
          await ContactService.deleteAll()
          this.refreshList()
        } catch (error) {
          console.log(error)
        }
      }
    },
    goToAddContact() {
      this.$router.push({ name: 'contact.add' })
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    },
  },
  mounted() {
    this.refreshList()
  },
}
</script>

<style scoped>
/* Màu sắc đồng bộ chuẩn với ContactCard và ContactForm */
.bg-music-custom {
  background-color: #b5179e;
}
.bg-sports-custom {
  background-color: #ff7096;
}
.bg-travel-custom {
  background-color: #4ea8de;
}
.bg-reading-custom {
  background-color: #74c69d;
}

/* Hiệu ứng nút bấm lọc */
.opacity-60 {
  opacity: 0.5;
}
.active-filter {
  opacity: 1;
  box-shadow: 0 0 0 2px #000;
}
</style>
