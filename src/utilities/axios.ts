import axios from 'axios'

// Create an instance of Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // Set your base URL here
})

export default api
