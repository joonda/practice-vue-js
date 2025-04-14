## 노트

### 1. Transition 컴포넌트
* `<Transition>`은 기본적으로 제공되는 컴포넌트
* `default slot`을 통해 전달된 컴포넌트가 나타나거나, 사라질 때 애니메이션을 적용하는 데 사용할 수 있다.

`src` > `components` > `AppAlert.vue`
```vue
<template>
  <Transition>
    <div v-if="show" class="app-alert alert" :class="styleClass" role="alert">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
/* ... 생략  */
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>

```
* `Transition` 컴포넌트를 원하는 위치에 감싸면 된다.
* `slide`를 적용하고 싶다면 `Transition`에 `name="slide"` 속성 추가 및 `style`에서 `v-`를 `slide-`로 변경 후 `transform: translateY(-30px)`, `transform: translateY(0px)` 등으로 위치 값을 조정한다.

### 2. TransitionGroup

`src` > `components` > `AppAlert.vue`
```vue
<template>
  <div class="app-alert">
    <TransitionGroup name="slide">
      <div
        v-for="({ message, type }, index) in items"
        :key="index"
        class="alert"
        :class="typeStyle(type)"
        role="alert"
      >
        {{ message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
})

const typeStyle = (type) => (type === 'error' ? 'alert-danger' : 'alert-primary')
</script>

<style scoped>
.app-alert {
  position: fixed;
  top: 10px;
  right: 10px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
```

`src` > `views` > `posts` > `PostEditView.vue` 
```vue
<template>
  <div>
    <!-- ... 생략 -->
    <AppAlert :items="alerts" />
  </div>
</template>

<script setup>
// ... 생략

const edit = async () => {
  try {
    await updatePost(id, { ...form.value })
    // router.push({ name: 'PostDetail' })
    vAlert('수정이 완료되었습니다.', 'primary')
  } catch (error) {
    console.log(error)
    vAlert(error.message)
  }
}
// ... 생략
const alerts = ref([])
const vAlert = (message, type = 'error') => {
  alerts.value.push({ message, type })
  setTimeout(() => {
    alerts.value.shift()
  }, 2000)
}
</script>

<style lang="scss" scoped></style>
```

### 3. Teleport 컴포넌트 : Modal 만들기
* `@click.stop`
  * event bubbling을 막을 수 있다.
* `Teleport`
  * 컴포넌트를 특정 돔으로 위치 이동시킬 때 사용함
  * 내장 컴포넌트이기 때문에 바로 사용 가능
