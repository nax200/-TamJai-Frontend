import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost/api'
})

const JWT_TOKEN_LOCALSTORAGE_KEY = 'jwt_token'
const token = localStorage.getItem(JWT_TOKEN_LOCALSTORAGE_KEY);

axiosInstance.defaults.headers.common['Accept'] = 'application/json;charset=UTF-8';
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export const authAPI = {
  async login (email, password) {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    })
    if (response.status == 200) {
      localStorage.setItem(JWT_TOKEN_LOCALSTORAGE_KEY, response.data.access_token)
      return true
    }
    return false
  },
  async me () {
    const _token = localStorage.getItem(JWT_TOKEN_LOCALSTORAGE_KEY)
    if (_token) {
      axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + _token
    }
    const response = await axiosInstance.post('/auth/me')
    if (response.status == 200) {
      return response.data.data
    } 
    return {}
  },
  logout () {
    localStorage.removeItem(JWT_TOKEN_LOCALSTORAGE_KEY)
  }
}

export const productAPI = {
  async getAll () {
    const response = await axiosInstance.get('/products')
    if (response.status == 200) {
      return response.data.data
    }
    return []
  },
  async saveNew (product) {
    product.balance = product.total_amount
    product.is_active = true
    const response = await axiosInstance.post('/products', product)
    if (response.status == 201) {
      return response.data
    }
    return {
      success: false
    }
  },
  async getSearch (keyword){
    const response = await axiosInstance.get('/products/search', { params: { q: keyword } })

    if (response.status == 200) {
      return response.data
    }
    return []
  },
}

export const categoriesAPI = {
  async getAll () {
    const response = await axiosInstance.get('/categories')
    if (response.status == 200) {
      return response.data
    }
    return []
  },
  async getProductsByCategoryId (categoryId) {
    const response = await axiosInstance.get(`/categories/${categoryId}`)
    if (response.status == 200) {
      return response.data.data.products
    }
    return []
  }
}

export const shopAPI = {
  async getAll() {
    const response = await axiosInstance.get('/shops')
    if (response.status == 200) {
      return response.data.data
    }
    return []
  },
  async getProductsByShopId(shopId) {
    const response = await axiosInstance.get(`/shops/${shopId}`)
    if (response.status == 200) {
      return response.data.data.products
    }
    return []
  }
}
