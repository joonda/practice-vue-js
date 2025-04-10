## 노트

### 1. Vue Router란? : 프로젝트 적용
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


### 2. Vue Router 학습 : 게시판 UI 만들기

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
    params: {
      id,
    },
  })
}
</script>

<style lang="scss" scoped></style>
```
* `useRouter` -> `push` 메서드를 활용하여 name, params, query 등을 지정 및 원하는 페이지로 이동할 수 있도록 지원한다
  * 여기서는 PostDetail (`/posts/:id`) 경로로 지정
* `ref` -> 게시글 목록을 반응형으로 만든 형태, 더미 데이터를 (post) `ref`의 `value`로 지정하여 넣어준다.
  * 만약, 더미 데이터의 목록에 변화가 생기면 자동으로 반영 된다.
  * `React`의 `useState`와 비슷한 개념, 변동 시 새로고침을 하는 것이 아닌 해당 부분만 재렌더링 한다.

### 3. 404 Not Found & 중첩 라우트 적용

#### 404 Not Found
* 일반 파라미터 `:id`는 슬래쉬 `/`로 구분된 URL 사이의 문자만 일치시킨다. 
* 무엇이든 일치시키려면 param 바로 뒤에 괄호 안에 정규식을 사용할 수 있다.

`router` > `index.js`
```javascript
import NotFoundView from '@/views/NotFoundView.vue'
const routes = [
    // ... 생략
  {
    path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView
  }
]
```
* 해당 path 추가, 404 Not Found path 같은 경우는 맨 밑에 지정해줘야 정상경로와 혼동되지 않는다.

#### 중첩 라우트 적용
* 특정 페이지 안에 `RouterView`를 중첩하여 설정할 수 있다.
`router` > `index.js`
```javascript
import NotFoundView from '@/views/NotFoundView.vue'
const routes = [
    // ... 생략
  {
    path: '/nested',
    name: 'Nested',
    component: NestedView,
    children: [
      {
        path: '',
        name: 'NestedHome',
        component: NestedHomeView,
      },
      {
        path: 'one',
        name: 'NestedOne',
        component: NestedOneView,
      },
      {
        path: 'two',
        name: 'NestedTwo',
        component: NestedTwoView,
      },
    ],
  },
]
```
* `routes`에서 `children` 메서드로 배열을 지정하여 중첩 라우트를 적용할 수 있다.
* path의 경우 `''`는 `/nested`와 동일하며, `one`은 `/nested/one`으로 지정할 수 있다.

`views` > `nested` > `NestedView.vue`
```vue
<template>
  <div>
    <ul class="nav nav-pills">
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" to="/nested/one">Nested One</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" to="/nested/two">Nested Two</RouterLink>
      </li>
    </ul>
    <hr class="my-4" />
    <RouterView></RouterView>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
```
* `RouterLink`로 경로를 지정
  * `RouterLink`에서 `to` 옵션 대신 `:to` 옵션을 지정하면 `replace`가 된다.
    * `to="/nested/one"` -> `:to="{name: 'NestedOne', replace: true}"`
    * `replace`로 지정하면 현재 페이지에서 지정된 컴포넌트가 대체된다 즉, `History`에 남지 않기 때문에 뒤로 가기 실행 시, 해당 페이지는 건너 뛰게 된다
* `RouterView`로 해당 페이지 컴포넌트 아래에 보여줄 화면을 설정한다.

### 4. 페이지 컴포넌트에 Props 전달

#### 해당 Post에 맞는 내용 넣기
* 현재 `/posts` 페이지에 있는 게시글들이 정적으로 선언되어있어 이를 동적으로 바꿔야 한다.

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

export function getPostById(id) {
  const numberId = parseInt(id)
  return posts.find((item) => item.id === numberId)
}
```
* `params`로 받아온 `id`와 `posts`에 정의되어있는 `id`가 같은 `post`를 전달하기 위한 `getPostById` 함수 정의
* `id`가 `String` 타입이기 때문에 `parseInt`로 정수화 한다

`src` > `views` > `posts`
```vue
<template>
  <div>
    <h2>{{ form.title }}</h2>
    <p>{{ form.content }}</p>
    <p class="text-muted">{{ form.createdAt }}</p>
    <!-- ... 생략 -->
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getPostById } from '@/api/posts'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const form = ref({})

const fetchPost = () => {
  const data = getPostById(id)
  form.value = { ...data }
}

fetchPost()

const goListPage = () => router.push({ name: 'PostList' })
const goEditPage = () => router.push({ name: 'PostEdit', params: { id } })
</script>

<style lang="scss" scoped></style>
```
* `ref`로 동적으로 `post` 내용을 담는다
* 또한 `{{form.}}`을 활용하여 `template`에 동적으로 지정한다.

#### 페이지 컴포넌트에 Props 전달하기
* `routes`에 지정된 url로 Props를 전달할 수 있다.

`router` > `index.js`
```javascript
import NotFoundView from '@/views/NotFoundView.vue'
const routes = [
    // ... 생략
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetailView,
    props: true,
  },
]
```
* props를 전달하여 미리보기 형식을 구현할 수 있다.

`src` > `views` > `posts` > `PostListView.vue`
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
  <PostDetailView id="2"></PostDetailView>
</template>

<script setup>
import PostItem from '@/components/posts/PostItem.vue'
import { ref } from 'vue'
import { getPosts } from '@/api/posts'
import { useRouter } from 'vue-router'
import PostDetailView from './PostDetailView.vue'

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
    params: {
      id,
    },
  })
}
</script>

<style lang="scss" scoped></style>
```
* `script` 부분에서 PostDetailView를 import 한 뒤, `template`에서 `component`로 지정한다. 
  * `component`로 지정한 뒤, `props`로 `id` 값을 넘겨준다 `<PostDetailView id="2"></PostDetailView>`

#### 페이지 컴포넌트에서 props를 확인하고, 적용하기
`src` > `views` > `posts` > `PostDetailView.vue`
```vue
<template>
  <div>
    <!-- 생략 -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getPostById } from '@/api/posts'
import { ref } from 'vue'

const props = defineProps({
  id: String,
})

// const route = useRoute()
const router = useRouter()
// const id = Number(route.params.id)
const form = ref({})

const fetchPost = () => {
  const data = getPostById(props.id)
  form.value = { ...data }
}

fetchPost()

const goListPage = () => router.push({ name: 'PostList' })
const goEditPage = () => router.push({ name: 'PostEdit', params: { id: props.id } })
</script>

<style lang="scss" scoped></style>
```
* `defineProps` 함수를 만들어서 `id`를 `String` 으로 지정한다.
* 기존에 `id`를 사용했던 부분을 `props.id`로 변경하여 `props`로 `id`를 전달 받게끔 지정.

#### 번외
* props는 객체 또는 함수로도 전달할 수 있다.

##### 객체
```javascript
props: {word : 'hello'}
```

##### 함수
```javascript
props: (route) => {
  return {
    id: parseInt(route.params.id),
  }
}
```
* 이렇게 되면 id는 Number 값이 되기 때문에, `PostDetailView` 컴포넌트에서도 id를 넘길때 숫자로 넘겨야한다.
* `<PostDetailView :id="2"></PostDetailView>` 이렇게 `:id` 형식으로 넘기면 값의 타입을 그대로 넘길 수 있다 (2는 숫자니까 그대로 `Number type`으로 넘겨진다)

### 5. History 모드 : SPA, SSR, CSR
* Router 인스턴스 생성시, history 옵션을 사용하면 다양한 history mode 중 선택 가능
  * Hash - createWebHashHistory()
    * 주소에 #이 들어감
    * 서버에 설정할 필요 없음 (서버는 # 이후를 신경쓰지 않기 때문)
  * History - createWebHistory()
    * 파라미터로 문자열을 넘기게 되면, URL 루트로 기본 루트가 붙는다. (Hash도 동일일)
    * 서버가 경로를 모두 `index.html`로 리다이렉트해주도록 설정해야한다.
      * 배포 후 사용자가 직접 `/posts/1`을 접속하면, 서버 경로로 생각해서 404로 반환하기 때문!
      * 그래서 서버가 Vue로 만든 모든 경로는 무조건 index.html로 보내도록 설정해줘야 한다.
    * SEO 최적화 유리, 주소가 깔끔
  * Memory - createMemoryHistory()

#### SPA, SSR, CSR
* UI에 보여질 HTML 문서를 서버에서 만들어서 내려주는 것을 `Server Side Rendering (SSR)` 이라고 한다.
  * Vue에서 초기 화면을 서버에서 HTML로 만들어 보내줌.
  * 초기 렌더링이 빠르고, SEO에 매우 유리
* 자바스크립트 코드로 HTML을 생성해 사용자에게 보여주는 것을 `Client Side Rendering (CSR)` 이라고 한다.
  * 서버에서는 Vue가 쓰는 라우팅들을 `index.html`로 리디렉션 해줘야한다.
  * `createWebHistory()` 사용 시, 필요한 설정
