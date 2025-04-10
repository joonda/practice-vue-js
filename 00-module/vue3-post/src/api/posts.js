import axios from 'axios'

// axios
// const posts = [
//   { id: 1, title: '제목 1', content: '내용 1', createdAt: '2020-01-01' },
//   { id: 2, title: '제목 2', content: '내용 2', createdAt: '2020-02-02' },
//   { id: 3, title: '제목 3', content: '내용 3', createdAt: '2020-03-03' },
//   { id: 4, title: '제목 4', content: '내용 4', createdAt: '2020-04-04' },
//   { id: 5, title: '제목 5', content: '내용 5', createdAt: '2020-05-05' },
//   { id: 6, title: '제목 6', content: '내용 6', createdAt: '2020-06-06' },
// ]

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
