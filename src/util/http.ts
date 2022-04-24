import axios from 'axios'
import {} from '@reduxjs/toolkit'
import { hideLoading, showLoading } from '../redux/reducers/LoadingReducer'
import { store } from '../redux/store'

const { dispatch } = store

axios.defaults.baseURL = 'http://localhost:8083'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log('first')
    dispatch({ type: 'loading/showLoading' })
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    console.log('second')
    dispatch({ type: 'loading/hideLoading' })
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)
