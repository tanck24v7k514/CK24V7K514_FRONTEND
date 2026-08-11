<script>
export default {
  props: {
    contact: { type: Object, required: true },
  },
  methods: {
    getBadgeClass(fav) {
      if (fav === 'Âm nhạc') return 'bg-music-custom'
      if (fav === 'Thể thao') return 'bg-sports-custom'
      if (fav === 'Du lịch') return 'bg-travel-custom'
      if (fav === 'Đọc sách') return 'bg-reading-custom'
      return 'bg-secondary'
    },
  },
}
</script>

<template>
  <div>
    <div class="p-1"><strong>Tên:</strong> {{ contact.name }}</div>
    <div class="p-1"><strong>E-mail:</strong> {{ contact.email }}</div>
    <div class="p-1"><strong>Địa chỉ:</strong> {{ contact.address }}</div>
    <div class="p-1"><strong>Điện thoại:</strong> {{ contact.phone }}</div>
    <div class="p-1 d-flex align-items-center flex-wrap gap-1">
      <strong>Liên hệ yêu thích:&nbsp;</strong>
      <template v-if="contact.favorite && contact.favorite.length">
        <span
          v-for="(fav, idx) in contact.favorite"
          :key="idx"
          class="badge mr-1"
          :class="getBadgeClass(fav.trim())"
          style="padding: 6px 10px; border-radius: 4px; color: #000; font-weight: bold"
        >
          {{ fav }}
        </span>
      </template>
      <span v-else class="text-muted">Không có</span>
    </div>
  </div>
</template>

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
</style>
