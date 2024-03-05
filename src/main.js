import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import uView from '@/uni_modules/uview-ui'
Vue.config.productionTip = false
Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
  ...App
})
import http from './utils/http.js'
import api from "./common/api.js"
import st from "@/common/storage.js"
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$st = st
app.$mount()
