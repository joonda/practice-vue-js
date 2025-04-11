## 노트

### 1. json-server & axios : CRUD 구현

#### 사용법
* json-server 설치 진행
  * 배포할 때는 제외할 것이기 때문에 -D 추가
```terminal
npm install -D json-server
```

#### db.json
* `db.json` 파일 추가 후, 임의의 데이터를 넣고 명령어 실행

* `db.json`
```json
{
  "posts": [
    { "id": 1, "title": "Hello" },
    { "id": 2, "title": "World" }
  ]
}
```

```terminal
npx json-server db.json
```

```
npx json-server db.json --port 5000
```
* 이렇게 5000번 포트로 지정할 수 있다.

`package.json`
```json
{ 
  // ... 생략 
  "scripts": {
    // ... 생략
    "db": "json-server db.json --port 5000"
  },
}
```
* `package.json` 파일에서 script에 해당 부분을 prefix화 할 수 있다.
  * terminal에 `npm run db` 명령어로 간략하게 실행할 수 있다.

#### axios
```terminal
npm install axios
```

* `src` > `api` > `posts.js` 
```javascript
import axios from 'axios'

export function getPosts() {
  return axios.get('http://localhost:5000/posts')
}

export function getPostById(id) {
  return axios.get(`http://localhost:5000/posts/${id}`)
}

export function createPost(data) {
  return axios.post('http://localhost:5000/posts', data)
}

export function updatePost(id, data) {
  return axios.put(`http://localhost:5000/posts/${id}`, data)
}

export function deletePost(id) {
  return axios.delete(`http://localhost:5000/posts/${id}`)
}
```
* `axios`를 활용해서 CRUD를 위한 메서드를 정의

#### PostList 
`src` > `views` > `posts` > `PostListView.vue`
```vue
<template>
  <!-- ... 생략 -->
</template>

<script setup>
// ... 생략 
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
// ... 생략
</script>
<style lang="scss" scoped></style>
```
* `fetchPosts` 함수를 정의
  * `async`, `await`으로 데이터를 가져오고, `ref`의 배열형태로 지정한 `posts`의 `value`로 지정

#### PostCreate

```vue
<template>
  <div>
    <h2>게시글 등록</h2>
    <hr class="my-4" />
    <form @submit.prevent="save">
      <div class="mb-3">
        <label for="title" class="form-label">제목</label>
        <input v-model="form.title" type="text" class="form-control" id="title" />
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">내용</label>
        <textarea v-model="form.content" class="form-control" id="content" rows="3"></textarea>
      </div>
      <div class="pt-4">
        <button type="button" class="btn btn-outline-dark me-2" @click="goListPage">목록</button>
        <button class="btn btn-primary">저장</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { createPost } from '@/api/posts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = ref({
  title: null,
  content: null,
})
const save = () => {
  try {
    const data = {
      ...form.value,
      createdAt: Date.now(),
    }
    createPost(data)
    router.push({ name: 'PostList' })
  } catch (error) {
    console.log(error)
  }
}
const goListPage = () => router.push({ name: 'PostList' })
</script>

<style lang="scss" scoped></style>
```
* `v-model`을 통한 양방향 데이터 바인딩 진행
* `ref`를 사용한 반응형 객체 선언
* `save` 함수 지정 후, `form` 태그에 `@submit.prevent`에 save 함수를 지정

#### PostDetail
```vue
<template>
  <div>
    <hr class="my-4" />
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>
    <p class="text-muted">{{ post.createdAt }}</p>
    <!-- ... 생략 -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getPostById } from '@/api/posts'
import { ref } from 'vue'

const props = defineProps({
  id: Number,
})

// const route = useRoute()
const router = useRouter()
// const id = Number(route.params.id)
const post = ref({})

const fetchPost = async () => {
  const { data } = await getPostById(props.id)
  setPost(data)
}

const setPost = ({ title, content, createdAt }) => {
  post.value.title = title
  post.value.content = content
  post.value.createdAt = createdAt
}

fetchPost()

const goListPage = () => router.push({ name: 'PostList' })
const goEditPage = () => router.push({ name: 'PostEdit', params: { id: props.id } })
</script>

<style lang="scss" scoped></style>
```
* `post` 객체를 `ref`로 선언
* 각각의 `value`를 `setPost` 함수로 지정 값을 넣어준다
  * `ref`의 `value` 속성 안에 진짜 값을 가지고 있기 때문에 `post.value.***` 형식으로 쓴다.

#### PostEdit
```vue
<template>
  <div>
    <h2>게시글 수정</h2>
    <hr class="my-4" />
    <form @submit.prevent="edit">
      <div class="mb-3">
        <label for="title" class="form-label">제목</label>
        <input v-model="form.title" type="text" class="form-control" id="title" />
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">내용</label>
        <textarea v-model="form.content" class="form-control" id="content" rows="3"></textarea>
      </div>
      <div class="pt-4">
        <button type="button" class="btn btn-outline-danger me-2" @click="goDetailPage">
          취소
        </button>
        <button class="btn btn-primary">수정</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { getPostById, updatePost } from '@/api/posts'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    router.push({ name: 'PostDetail' })
  } catch (error) {
    console.log(error)
  }
}

const goDetailPage = () => router.push({ name: 'PostDetail' })
</script>

<style lang="scss" scoped></style>

```
* `useRoute`로 넘겨받은 id 파라미터를 이용한다.
* `form` 객체를 `ref`로 선언하여 `title`, `content`, `createdAt`을 받는다 (`createdAt`은 나중에 수정이 필요함.)
* `getPostById`의 `id`와 `setForm`으로 메서드를 구현
* `edit` 함수를 구현하여 `updatePost` api를 호출한다, 파라미터 값으로 `id`와 `form.value` 값을 넣는다.

#### PostDelete

```vue
<template>
  <div>
    <!-- ...생략 -->
    <div class="col-auto">
      <button class="btn btn-outline-danger" @click="removePost">삭제</button>
    </div>
  </div>
</template>

<script setup>
// ... 생략
const removePost = () => {
  deletePost(props.id)
  router.push({ name: 'PostList' })
}
</script>

<style lang="scss" scoped></style>
```
* `@click`으로 `removePost` 함수 지정
  * `deletePost` api 호출 후, id를 파라미터 값으로 넘겨줌

### 2. Pagination & Filter 구현하기
#### Pagination

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
    <nav class="mt-5" aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: !(params._page > 1) }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="--params._page">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="page in pageCount"
          :key="page"
          class="page-item"
          :class="{ active: params._page === page }"
        >
          <a class="page-link" href="#" @click.prevent="params._page = page">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !(params._page < pageCount) }">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="++params._page">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <br class="my-5" />
  <AppCard>
    <PostDetailView :id="2"></PostDetailView>
  </AppCard>
</template>

<script setup>
import PostItem from '@/components/posts/PostItem.vue'
import AppCard from '@/components/AppCard.vue'
import { computed, ref, watchEffect } from 'vue'
import { getPosts } from '@/api/posts'
import { useRouter } from 'vue-router'
import PostDetailView from './PostDetailView.vue'

const router = useRouter()
const posts = ref([])
// pagination

const params = ref({
  _sort: 'createdAt',
  _order: 'desc',
  _page: 1,
  _limit: 3,
})

const totalCount = ref(0)
const pageCount = computed(() => Math.ceil(totalCount.value / params.value._limit))

const fetchPosts = async () => {
  try {
    const { data, headers } = await getPosts(params.value)
    posts.value = data
    totalCount.value = headers['x-total-count']
  } catch (error) {
    console.log(error)
  }
}

// fetchPosts()
watchEffect(fetchPosts)
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
##### 현재 버전 이슈로 json-server 0.17.4 버전 install 하고 진행함
* `_sort`, `_order` 파라미터를 활용해서 내림차순으로 구현
* `totalCount`를 동적으로 선언한 후, `headers`의 `x-total-count`를 받아온다.
* 또한 `pageCount`를 `computed`로 선언한 후, `totalCount` / `limit`를 올림 처리하여 총 페이지의 개수를 구한다.
  * 이를 `v-for`로 돌리면서 `{{page}}`를 넣어준다.
  * 이후 `:class`로 `active`를 줘서 해당되는 페이지로 이동 시, 강조 효과를 준다.
* `<a class="page-link" href="#" @click.prevent="params._page = page">{{ page }}</a>` `@click` 이벤트로 원하는 페이지로 이동할 수 있도록 구현한다.
* `<<` `>>`도 `@click` 이벤트로 증감 연산자를 통해 구현 (++params._page, --params._page)
  * params._page가 pageCount보다 크다면 (같은 것도 포함), `>>` 을 비활성화
  * params._page가 1보다 작아진다면 (같은 것도 포함) `<<`을 비활성화

#### Filter
* json-server 에서 제공하는 `title_like`로 Filter 기능을 구현할 수 있다.

```vue
<template>
  <form @submit.prevent>
    <div class="row g-3">
      <div class="col">
        <input v-model="params.title_like" type="text" class="form-control" />
      </div>
      <div class="col-3">
        <select v-model="params._limit" class="form-select">
          <option value="3">3개씩 보기</option>
          <option value="6">6개씩 보기</option>
          <option value="9">9개씩 보기</option>
        </select>
      </div>
    </div>
  </form>
</template>

<script setup>
const params = ref({
  _sort: 'createdAt',
  _order: 'desc',
  _page: 1,
  _limit: 3,
  title_like: '',
})
</script>
```
* `title_like`와 `form` 안에 있는 `input` 태그에 양방향 바인딩을 할 수 있다.
  * 또한 `watchEffect`로 `fetchPosts`함수 내의 값이 동적으로 변경될 때 마다 자동으로 다시 콜백하기 때문에 자동으로 필터링이 구현된다
* `v-model`을 통해서 또한 value 값을 `_limit`와 연동하여 n개씩 보기를 구현할 수 있다.

### 3. axios 모듈 & Vite 환경 변수 설정 (env)
#### axios
* axios에서는 create를 통해서 Instance를 만들 수 있도록 지원한다.

* `src` > `api` > `index.js`

```javascript
import axios from 'axios'

function create(baseURL, options) {
  const instance = axios.create(Object.assign({ baseURL }, options))
  return instance
}

export const posts = create('http://localhost:5000/posts/')
```

* `src` > `api` > `posts.js`

```javascript
import { posts } from '.'

export function getPosts(params) {
  return posts.get('/', { params })
}

export function getPostById(id) {
  return posts.get(`/${id}`)
}

export function createPost(data) {
  return posts.post('/', data)
}

export function updatePost(id, data) {
  return posts.put(`/${id}`, data)
}

export function deletePost(id) {
  return posts.delete(`/${id}`)
}
```
* 이렇게 중복되는 코드를 제거하여 깔끔하게 유지할 수 있다.

#### Vite
* Vite에서 환경변수를 가져올 때는 `import.meta.env`로 가져올 수 있다

* `src` > `main.js`
```javascript
console.log('MODE: ', import.meta.env.MODE)
console.log('BASE_URL: ', import.meta.env.BASE_URL)
console.log('PROD: ', import.meta.env.PROD)
console.log('DEV: ', import.meta.env.DEV)
```
* MODE는 현재 어떤 모드인지 알려주는 환경변수
* BASE_URL은 기본 세팅된 URL
* PROD -> 현재 production 모드인지 알려줌 (T/F)
* DEV -> 현재 Development 모드인지 알려줌 (T/F)

`vite.config.js`
```javascript
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  mode: 'development',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
```
* 여기에 option으로 mode를 설정할 수 있다.
  * 기본은 development 모드, 빌드할때는 production 모드로 설정
* 다른 변수를 가져오기 위해서는 환경변수 파일을 설정해야한다 (`env`)

`.env`
```env
VITE_APP_API_URL=http://localhost:5001/
```

`.env.development`
```env
VITE_APP_API_URL=http://localhost:5000/
```

`main.js`
```javascript
console.log('env: ', import.meta.env.VITE_APP_API_URL)
```

* 여기서 중요한 점은, VITE를 prefix로 꼭 붙여줘야한다는 점! (없으면 못가져온다.)
  * envPrefix가 default로 `VITE_`로 되어있다.
  * 변경을 원한다면 `vite.config.js` 에서 `envPrefix` 옵션으로 변경할 수 있다.

`index.js`
```javascript
export const posts = create(`${import.meta.env.VITE_APP_API_URL}posts/`)
```
* 이렇게 구현할 수 있다.