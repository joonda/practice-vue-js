<template>
  <div>
    <h2>게시글 목록</h2>
    <hr class="my-4" />
    <div class="row g-3">
      <div v-for="post in posts" :key="post.id" class="col-4">
        <PostItem
          :title="post.title"
          :content="post.content"
          :createdAt="post.createdAt"
          @click="goPage(post.id)"
        ></PostItem>
      </div>
    </div>
  </div>
  <br class="my-4" />
  <AppCard>
    <PostDetailView :id="2"></PostDetailView>
  </AppCard>
</template>

<script setup>
import PostItem from '@/components/posts/PostItem.vue'
import AppCard from '@/components/AppCard.vue'
import { ref } from 'vue'
import { getPosts } from '@/api/posts'
import { useRouter } from 'vue-router'
import PostDetailView from './PostDetailView.vue'

const router = useRouter()
const posts = ref([])

const fetchPosts = async () => {
  try {
    const { data } = await getPosts()
    posts.value = data
  } catch (error) {
    console.log(error)
  }
}

fetchPosts()

const goPage = (id) => {
  // router.push(`/posts/${id}`)
  router.push({
    name: 'PostDetail',
    params: {
      id,
    },
  })
}
</script>

<style lang="scss" scoped></style>
