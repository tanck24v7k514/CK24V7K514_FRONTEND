<template>
  <div class="page row">
    <div class="col-md-10 mb-3">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mb-3 d-flex gap-2 flex-wrap">
      <button
        class="btn btn-sm"
        :class="selectedFilters.length === 0 ? 'btn-dark' : 'btn-outline-dark'"
        @click="clearFilters"
      >
        Tất cả
      </button>

      <button
        class="btn btn-sm bg-music-custom text-white"
        :class="{ 'opacity-50': !isFilterSelected('Âm nhạc') }"
        @click="toggleFilter('Âm nhạc')"
      >
        Âm nhạc <i v-if="isFilterSelected('Âm nhạc')"></i>
      </button>

      <button
        class="btn btn-sm bg-sports-custom text-white"
        :class="{ 'opacity-50': !isFilterSelected('Thể thao') }"
        @click="toggleFilter('Thể thao')"
      >
        Thể thao <i v-if="isFilterSelected('Thể thao')"></i>
      </button>

      <button
        class="btn btn-sm bg-travel-custom text-white"
        :class="{ 'opacity-50': !isFilterSelected('Du lịch') }"
        @click="toggleFilter('Du lịch')"
      >
        Du lịch <i v-if="isFilterSelected('Du lịch')"></i>
      </button>

      <button
        class="btn btn-sm bg-reading-custom text-white"
        :class="{ 'opacity-50': !isFilterSelected('Đọc sách') }"
        @click="toggleFilter('Đọc sách')"
      >
        Đọc sách <i v-if="isFilterSelected('Đọc sách')"></i>
      </button>
    </div>

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
      selectedFilters: [],
      currentPage: 1,
      pageSize: 5,
      sortOrder: 'asc',
    }
  },
  watch: {
    searchText() {
      this.resetSelection()
    },
    selectedFilters: {
      handler() {
        this.resetSelection()
      },
      deep: true,
    },
    sortOrder() {
      this.resetSelection()
    },
  },
  computed: {
    filteredContacts() {
      let list = this.contacts
      if (this.selectedFilters.length > 0) {
        list = list.filter((contact) => {
          if (!Array.isArray(contact.favorite)) return false
          return this.selectedFilters.every((filter) => contact.favorite.includes(filter))
        })
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
    isFilterSelected(name) {
      return this.selectedFilters.includes(name)
    },

    toggleFilter(name) {
      const index = this.selectedFilters.indexOf(name)
      if (index > -1) {
        this.selectedFilters.splice(index, 1)
      } else {
        this.selectedFilters.push(name)
      }
    },

    clearFilters() {
      this.selectedFilters = []
    },

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

.opacity-60 {
  opacity: 0.5;
}

.active-filter {
  opacity: 1;
  box-shadow: 0 0 0 2px #000;
}
</style>
