<template>
  <div>
    <h2>게시글 수정</h2>
    <hr class="my-4" />
    <PostForm v-model:title="form.title" v-model:content="form.content" @submit.prevent="edit">
      <template #actions>
        <button type="button" class="btn btn-outline-danger" @click="goDetailPage">취소</button>
        <button class="btn btn-primary">수정</button>
      </template>
    </PostForm>
  </div>
</template>

<script setup>
import { getPostById, updatePost } from '@/api/posts'
import PostForm from '@/components/posts/PostForm.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlert } from '@/composables/alert'

const { vAlert, vSuccess } = useAlert()

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({
  title: null,
  content: null,
  createdAt: Date.now(),
})

const fetchPost = async () => {
  const { data } = await getPostById(id)
  setForm(data)
}

const setForm = ({ title, content }) => {
  form.value.title = title
  form.value.content = content
}

fetchPost()

const edit = async () => {
  try {
    await updatePost(id, { ...form.value })
    vSuccess('수정이 완료되었습니다.')
    router.push({ name: 'PostDetail' })
  } catch (error) {
    console.log(error)
    vAlert(error.message)
  }
}

const goDetailPage = () => router.push({ name: 'PostDetail' })
</script>

<style lang="scss" scoped></style>
