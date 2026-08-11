<template>
  <Form @submit="submitContact" :validation-schema="contactFormSchema">
    <div class="form-group">
      <label for="name">Tên</label>
      <Field name="name" type="text" class="form-control" v-model="contactLocal.name" />
      <ErrorMessage name="name" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="email">E-mail</label>
      <Field name="email" type="email" class="form-control" v-model="contactLocal.email" />
      <ErrorMessage name="email" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="address">Địa chỉ</label>
      <Field name="address" type="text" class="form-control" v-model="contactLocal.address" />
      <ErrorMessage name="address" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="phone">Điện thoại</label>
      <Field name="phone" type="tel" class="form-control" v-model="contactLocal.phone" />
      <ErrorMessage name="phone" class="error-feedback" />
    </div>

    <div class="form-group">
      <label class="d-block"><strong>Liên hệ yêu thích:</strong></label>
      <div class="btn-group-toggle" data-toggle="buttons">
        <button
          v-for="option in favoriteOptions"
          :key="option.name"
          type="button"
          class="btn mr-2 mb-2 font-weight-bold"
          :class="isFavoriteSelected(option.name) ? option.activeClass : 'btn-dark opacity-50'"
          @click="toggleFavorite(option.name)"
        >
          {{ option.name }}
        </button>
      </div>
    </div>

    <div class="form-group mt-3">
      <button class="btn btn-primary">Lưu</button>
      <button
        v-if="contactLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteContact"
      >
        Xóa
      </button>
      <button type="button" class="ml-2 btn btn-secondary" @click="Cancel">Thoát</button>
    </div>
  </Form>
</template>

<script>
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  components: { Form, Field, ErrorMessage },
  emits: ['submit:contact', 'delete:contact'],
  props: {
    contact: { type: Object, required: true },
  },
  data() {
    const contactFormSchema = yup.object().shape({
      name: yup.string().required('Tên phải có giá trị.').min(2).max(50),
      email: yup.string().email('E-mail không đúng.').max(50),
      address: yup.string().max(100),
      phone: yup
        .string()
        .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
    })

    return {
      contactLocal: {
        ...this.contact,
        favorite: Array.isArray(this.contact.favorite) ? [...this.contact.favorite] : [],
      },
      contactFormSchema,
      favoriteOptions: [
        { name: 'Âm nhạc', activeClass: 'btn-music' },
        { name: 'Thể thao', activeClass: 'btn-sports' },
        { name: 'Du lịch', activeClass: 'btn-travel' },
        { name: 'Đọc sách', activeClass: 'btn-reading' },
      ],
    }
  },
  watch: {
    contact: {
      handler(val) {
        this.contactLocal = {
          ...val,
          favorite: Array.isArray(val.favorite) ? [...val.favorite] : [],
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    isFavoriteSelected(name) {
      return this.contactLocal.favorite && this.contactLocal.favorite.includes(name)
    },
    toggleFavorite(name) {
      if (!Array.isArray(this.contactLocal.favorite)) {
        this.contactLocal.favorite = []
      }
      const index = this.contactLocal.favorite.indexOf(name)
      if (index > -1) {
        this.contactLocal.favorite.splice(index, 1)
      } else {
        this.contactLocal.favorite.push(name)
      }
    },
    submitContact() {
      this.$emit('submit:contact', this.contactLocal)
    },
    deleteContact() {
      this.$emit('delete:contact', this.contactLocal._id)
    },
    Cancel() {
      if (window.confirm('Bạn có muốn thoát?')) {
        this.$router.push({ name: 'contactbook' })
      }
    },
  },
}
</script>

<style scoped>
/* 2. Cập nhật lại các mã màu đồng bộ với giao diện hiển thị chi tiết */
.btn-music {
  background-color: #b5179e;
  color: #000;
}
.btn-sports {
  background-color: #ff7096;
  color: #000;
}
.btn-travel {
  background-color: #4ea8de;
  color: #000;
}
.btn-reading {
  background-color: #74c69d;
  color: #000;
}
.opacity-50 {
  opacity: 0.4;
}
</style>
