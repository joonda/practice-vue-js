## 노트

### 1. Composable 이란?: Alert 컴포저블 함수
* Vue Composition API를 활용하여 상태 저장 비즈니스 로직을 캡슐화 하고 재사용하는 기능
`src` > `composables` > `alert.js` 
```javascript
import { ref } from 'vue'
export function useAlert() {
  const alerts = ref([])
  const vAlert = (message, type = 'error') => {
    alerts.value.push({ message, type })
    setTimeout(() => {
      alerts.value.shift()
    }, 2000)
  }

  const vSuccess = (message) => vAlert(message, 'success')

  return {
    alerts,
    vAlert,
    vSuccess,
  }
}
```
* 컴포저블이라는 개념은 컴포지션 API를 사용해서 상태 저장 비즈니스 로직을 캡슐화하고 재사용하는 것을 뜻한다.