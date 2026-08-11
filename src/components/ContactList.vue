<script>
export default {
  props: {
    contacts: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ['update:activeIndex'],
  methods: {
    updateActiveIndex(index) {
      this.$emit('update:activeIndex', index)
    },
  },
}
</script>

<template>
  <ul class="list-group">
    <li
      class="list-group-item d-flex align-items-center"
      v-for="(contact, index) in contacts"
      :key="contact._id"
      :class="{ active: index === activeIndex }"
      @click="updateActiveIndex(index)"
    >
      <img
        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random&color=fff&size=40`"
        class="rounded-circle mr-3"
        alt="Avatar"
        width="40"
        height="40"
      />
      <div class="ms-3">
        <div class="font-weight-bold">{{ contact.name }}</div>
        <small class="text-muted">{{ contact.phone }}</small>
      </div>
    </li>
  </ul>
</template>
