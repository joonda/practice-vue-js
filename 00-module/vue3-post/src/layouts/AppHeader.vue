<template>
  <header>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Hyun</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/" active-class="active">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/about" active-class="active">About</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/posts" active-class="active">Posts</RouterLink>
            </li>
          </ul>
        </div>
        <div class="d-flex">
          <button class="btn btn-outline-light" type="button" @click="goPage">글쓰기</button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goPage = () => {
  router.push({
    name: 'PostCreate',
  })
}
</script>

<style scoped></style>
