## 노트

### 1. 공통 컴포넌트 분리 (based on Vue.js 3 spec)

* `PostCreate.vue` -> 전체 흐름
* `PostForm.vue` -> 입력 폼만 담당

`src` > `views` > `posts` > `PostCreateView.vue`
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
// ... 생략
</script>

<style lang="scss" scoped></style>
```
* 기존의 코드

`src` > `views` > `posts` > `PostCreateView.vue`
```vue
<template>
  <div>
    <h2>게시글 등록</h2>
    <hr class="my-4" />
    <PostForm 
      v-model:title="form.title" 
      v-model:content="form.content" 
      @submit.prevent="save"
    >
      <template #actions>
        <div class="pt-4">
          <button type="button" class="btn btn-outline-dark me-2" @click="goListPage">목록</button>
          <button class="btn btn-primary">저장</button>
        </div>
      </template>
    </PostForm>
  </div>
</template>

<script setup>
// ... 생략
</script>

<style lang="scss" scoped></style>
```


`src` > `components` > `posts` > `PostForm.vue`
```vue
<template>
  <form>
    <div class="mb-3">
      <label for="title" class="form-label">제목</label>
      <input
        :value="title"
        @input="$emit('update:title', $event.target.value)"
        type="text"
        class="form-control"
        id="title"
      />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용</label>
      <textarea
        :value="content"
        @input="$emit('update:content', $event.target.value)"
        class="form-control"
        id="content"
        rows="3"
      ></textarea>
    </div>
    <slot name="actions"> </slot>
  </form>
</template>

<script setup>
defineProps({
  title: String,
  content: String,
})

defineEmits(['update:title', 'update:content'])
</script>

<style lang="scss" scoped></style>
```

##### * Props
* `PostCreateView.vue`
  * `v-model:title="form.title"`, `v-model:content="form.content"`
    * 자식 컴포넌트인 PostForm 컴포넌트에 props를 전달.
* `PostForm.vue`
  * `:value="title"`
    * 부모로부터 받은 값 (title)을 표시 (v-bind로 title 변수 값을 바인딩)
  * `@input="$emit('update:title', $event.target.value)"`
    * 사용자가 입력하면 그 값을 부모에게 다시 보냄.
    * `@`는 이벤트 리스너 -> 입력되는 실시간으로 부모에게 전달
  * `defineProps`, `defineEmits`을 꼭 선언해줘야한다!
  * props로 자식 컴포넌트에 넘겨준 후, `:value`로 값을 표시한다. 이후 사용자가 수정 시, `$emit`으로 부모 컴포넌트에 알려준다.
    * 즉, `v-model:xxx` -> `:value:xxx` -> `$emit(update:xxx, 변경 값)`은 서로 연결되어있어야 한다.

##### * slot
* 부모가 자식 컴포넌트 내부에 내용을 끼워넣을 수 있는 자리
* `PostCreateView.vue`
  * `<template #actions><button /></template>`
* `PostForm.vue`
  * `<slot name="actions">부모 컴포넌트에서 지정한 버튼이 들어온다</slot>`

### 2. Alert 공통 컴포넌트
`src` > `views` > `posts` > `PostEditView.vue` 
```vue
<template>
  <div>
    <!-- ...생략 -->
    <AppAlert :show="showAlert" :message="alertMessage" :type="alertType" />
  </div>
</template>

<script setup>
// ... 생략

const edit = async () => {
  try {
    await updatePost(id, { ...form.value })
    // router.push({ name: 'PostDetail' })
    vAlert('수정이 완료되었습니다.', 'success')
  } catch (error) {
    console.log(error)
    vAlert('네트워크 오류!')
  }
}

// ... 생략

const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('')

const vAlert = (message, type = 'error') => {
  showAlert.value = true
  alertMessage.value = message
  alertType.value = type
  setTimeout(() => {
    showAlert.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped></style>
```
* `AppAlert` 컴포넌트에 `showAlert`, `alertMessage`, `alertType`을 넘겨준다.
* 이후 vAlert 함수를 선언, showAlert를 true로 변경 후 message와 type('error'는 기본 값)을 전달, 2초 뒤 없어지도록 만듦

`src` > `components` > `AppAlert.vue`
```vue
<template>
  <div v-if="show" class="app-alert alert" :class="styleClass" role="alert">
    {{ message }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['success', 'error'].includes(value),
  },
})

const styleClass = computed(() => (props.type === 'error' ? 'alert-danger' : 'alert-success'))
</script>

<style scoped>
.app-alert {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
```
* props로 `show`, `message`, `type`을 받는다.
