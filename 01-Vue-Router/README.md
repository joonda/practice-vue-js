## 노트

### Vue Router란? : 프로젝트 적용
* 뷰 라우터는 Vue.js를 이용하여 싱글 페이지 애플리케이션(SPA)를 구현할 때 사용하는 Vue.js의 공식 라우터
* URL에 따라 어떤 페이지를 보여줄지 매핑해주는 라이브러리

#### 1. `router` > `index.js`
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/about',
    component: AboutView,
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
```
* `routes` 배열에 각 경로와 (`path`) 연결할 컴포넌트 (`component`)를 지정한다.
* `createRouter()`를 사용하여 라우터 인스턴스를 생성하고, `history`모드와 `routes`를 설정한다.
  * `createWebHistory('/')`는 깔끔한 URL을 제공
* 생성한 `router` 인스턴스를 export하여 앱에 연결할 수 있도록 한다.

#### 2. `main.js`
```javascript
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
import 'bootstrap/dist/js/bootstrap.bundle.js'
```
* 앱에 router 등록
  * `createApp(App).use(router).mount('#app')` 부분에서 확인이 가능하다.

#### 3. `layouts` > `AppView.vue`
```vue
<template>
  <div class="container py-4">
    <RouterView></RouterView>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
```
* `<RouterView>` 컴포넌트를 활용하여 현재 경로에 따라 알맞은 페이지 컴포넌트를 렌더링한다.

#### 4. `layouts` > `AppHeader.vue`
```vue
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
              <RouterLink class="nav-link active" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link active" to="/about">About</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {}
</script>

<style scoped></style>
```
* 여기서 `RouterLink`를 활용, `to` 옵션으로 경로 지정을 해준다.
* 이를 통해 `a`태그 처럼 페이지 새로고침 없이 `Vue Router`가 내부적으로 경로를 전환한다.

#### 번외

`views` > `HomeView.vue`
```vue
<template>
  <div>
    <h2>Home View</h2>
    <p>{{ $route }}</p>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
```
* `$route`를 통해서 현재 path에 대한 정보나, 현재 페이지 컴포넌트에 대한 다양한 정보가 있는 것을 확인할 수 있다.
* `$router` 포함

```
{ "fullPath": "/", "path": "/", "query": {}, "hash": "", "params": {}, "matched": [ { "path": "/", "meta": {}, "props": { "default": false }, "children": [], "instances": { "default": {} }, "leaveGuards": { "Set(0)": [] }, "updateGuards": { "Set(0)": [] }, "enterCallbacks": {}, "components": { "default": { "__hmrId": "b4e148ca", "__file": "C:/Users/haionnet/Desktop/private/practice-vue-js/00-module/vue3-post/src/views/HomeView.vue" } }, "__vd_id": "0" } ], "meta": {}, "href": "/" }
```

#### 번외 2
* 또한 `$router`를 활용하여 이동을 구현할 수 있다.
`views` > `AboutView.vue`
```vue
<template>
  <div>
    <h2>About View</h2>
    <button class="btn btn-primary" @click="$router.push('/')">Home으로 이동</button>
  </div>
</template>

<script setup></script>

<style scoped></style>
```
* `$router.push`를 사용하여 `@click`에 붙여서 구현할 수 있다.
* 아니면 `useRouter`를 import 하여 활용할 수 있다.

`views` > `HomeView.vue`
```vue
<template>
  <div>
    <h2>Home View</h2>
    <button class="btn btn-primary" @click="goAboutPage">About으로 이동</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goAboutPage = () => {
  router.push('/about')
}
</script>

<style scoped></style>
```
* `@click`에 커스텀 메서드 이름을 지정하고 `useRouter`를 import 하여 `router.push` 메서드로 구현할 수 있다.


### Vue Router 학습 : 게시판 UI 만들기

#### routes path 추가
`router` > `index.js`
```javascript
// ... 생략

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/posts',
    name: 'PostList',
    component: PostListView,
  },
  {
    path: '/posts/create',
    name: 'PostCreate',
    component: PostCreateView,
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetailView,
  },
  {
    path: '/posts/:id/edit',
    name: 'PostEdit',
    component: PostEditView,
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
```
* `posts`에 관련된 path 추가
* `:id` 같은 경우는 해당 경로에 어떤 문자가 오든 상관없음!
  * 동적 경로
  * 또한 `$route.params`를 활용하여 해당 parameter를 받을 수 있다.
  * `/posts/alice`
    * -> `{"id", "alice"}`
  * query, hash로도 받을 수 있음.
    * `/posts/alice?search=vue3` -> `{"search" : "vue3"}` (`$route.query`로 접근)
    * `/posts/alice#hashvalue` -> `#hashvalue` (`$route.hash`로 접근)
  
#### 더미 데이터 적재
* `api` > `posts.js`
```javascript
// axios
const posts = [
  { id: 1, title: '제목 1', content: '내용 1', createdAt: '2020-01-01' },
  { id: 2, title: '제목 2', content: '내용 2', createdAt: '2020-02-02' },
  { id: 3, title: '제목 3', content: '내용 3', createdAt: '2020-03-03' },
  { id: 4, title: '제목 4', content: '내용 4', createdAt: '2020-04-04' },
  { id: 5, title: '제목 5', content: '내용 5', createdAt: '2020-05-05' },
  { id: 6, title: '제목 6', content: '내용 6', createdAt: '2020-06-06' },
]

export function getPosts() {
  return posts
}
```

#### 게시글 목록 페이지 만들기

`views` > `posts` > `PostListView.vue`
```vue
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
</template>

<script setup>
import PostItem from '@/components/posts/PostItem.vue'
import { ref } from 'vue'
import { getPosts } from '@/api/posts'
import { useRouter } from 'vue-router'

const router = useRouter()
const posts = ref([])

const fetchPosts = () => {
  posts.value = getPosts()
}

fetchPosts()

const goPage = (id) => {
  // router.push(`/posts/${id}`)
  router.push({
    name: 'PostDetail',
  })
}
</script>

<style lang="scss" scoped></style>
```