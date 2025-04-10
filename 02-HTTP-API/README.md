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